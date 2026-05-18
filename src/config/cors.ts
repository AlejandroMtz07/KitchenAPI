import {CorsOptions} from 'cors'

export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        
        const allowedOrigin = 'https://kitchenrecip.netlify.app';

        // Permitir requests sin origin (Postman, mobile apps, etc.)
        if (!origin) {
            return callback(null, true);
        }

        if (origin === allowedOrigin) {
            return callback(null, true);
        }

        return callback(new Error('CORS no permitido'));

    }
}