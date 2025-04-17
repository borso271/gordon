'use client';

import { useEffect, useState } from 'react';
import styles from './ChatHistory.module.css';
import { useConversation } from '../../../../app/context/conversationContext';
import { useRouter } from 'next/navigation'; // for App Router
import Icon from '../../../Icons/Icon';
/* ... */
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';


type Conversation = {
  id: string;
  title: string | null;
  created_at: string;
};

type GroupedConversations = {
  [key: string]: Conversation[];
};

const groupByDate = (conversations: Conversation[], t: TFunction): GroupedConversations => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const groups: GroupedConversations = {
    [t('history.today')]: [],
    [t('history.lastWeek')]: [],
    [t('history.lastMonth')]: [],
    [t('history.older')]: []
  };

  for (const convo of conversations) {
    const created = new Date(convo.created_at);

    if (created >= today) {
      groups[t('history.today')].push(convo);
    } else if (created >= oneWeekAgo) {
      groups[t('history.lastWeek')].push(convo);
    } else if (created >= oneMonthAgo) {
      groups[t('history.lastMonth')].push(convo);
    } else {
      groups[t('history.older')].push(convo);
    }
  }

  return groups;
};

export default function ConversationHistory({
  user_id

}: {
  user_id: string;
  
}) {
  const {setThreadId} = useConversation();
  const [grouped, setGrouped] = useState<GroupedConversations | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


const { t } = useTranslation();


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/fetch_conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id })
        });

        const json = await res.json();
        const data: Conversation[] = json.conversations || [];
        const grouped = groupByDate(data, t);
        setGrouped(grouped);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user_id, t]);


  async function handleDeleteThread(thread_id: string) {
    try {
      const res = await fetch('/api/delete_thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error('Failed to delete thread:', data.error);
        return;
      }
  
      // ✅ Remove deleted thread from grouped state
      setGrouped((prevGrouped) => {
        if (!prevGrouped) return null;
  
        const updatedGrouped: GroupedConversations = {};
  
        for (const [label, items] of Object.entries(prevGrouped)) {
          updatedGrouped[label] = items.filter((c) => c.id !== thread_id);
        }
  
        return updatedGrouped;
      });
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  }
  
  const handleLabelClick = (conversation: Conversation) => {

    setThreadId(conversation.id);

   // router.push(`/landing?threadId=${conversation.id}`);

  };

  if (loading) return <div>Loading...</div>;
  if (!grouped) return <div>No conversations found.</div>;

  return (
    <div className={styles.container}>
      {Object.entries(grouped).map(([label, items]) =>
        items.length > 0 ? (
          <div key={label} className={styles.section}>
            <h2 className={styles.sectionTitle}>{label}</h2>
            <div className={styles.conversationList}>
              {items.map(convo => (

<div
  key={convo.id}
  className={styles.conversationItem}
  onClick={() => handleLabelClick(convo)}
  style={{ cursor: 'pointer' }}
>
  <div className={styles.conversationTitle}>
    {convo.title || 'Untitled Conversation'}
  </div>

  <div
    className={styles.trashIconWrapper}
    onClick={(e) => {
      e.stopPropagation(); // prevent triggering label click
      handleDeleteThread(convo.id);
    }}
  >
    <Icon name="trash" />
  </div>
</div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}  


