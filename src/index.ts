import server from './server';

const PORT = process.env.PORT || 8080;

//Running the server
server.listen(PORT, ()=>{
    console.log('Running server on '+PORT);
})