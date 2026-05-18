import {CorsOptions} from 'cors'

export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        
        if(origin === 'https://kitchenrecip.netlify.app/'){
            callback(null,true);
        }else{
            callback(new Error('CORS error'));
        }

    }
}