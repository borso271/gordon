"use client"

import React from 'react';
// import LlamaQuery from '../../../components/LlamaQuery/LlamaQuery';
import WebSearchTest from '../../../components/tests/openai_search';
import ExtractTest from '../../../components/tests/openai_summarize';
import FollowUpTester from '../../../components/tests/test_follow_ups';
const TestChatPage = () => {

  return (
    <div>
    <h1 className="text-2xl font-bold mb-4">Follow-Up Suggestions Tester</h1>
    <WebSearchTest/>
    </div>
  );
};

export default TestChatPage;