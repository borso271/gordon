Some of the components will also have to fetch from redux,
so be sure that's well implemented and clear.

be sure they load fast with cached data if redux has any problem.

1. The easiest to do are the one that just use the stored data like ratings and news.
2. Card, and Snapshot kind of go together
3. Finally the Chart

So develop them and review them in this order.

This should be done fast and easily today, before we go back to assistant.



--- --- ---


Next is a very well done and best practice architecture for the live data fetching for the other components. With backoff and graceful results if data is not found or websocket not running.

Develop them (basic no design).

Go to assistant part finally.