import { APP_CONFIG } from "../config/appConfig";


export function validateConfig(){


    const required = [

        {
            name:"JIRA_CLIENT_ID",
            value:APP_CONFIG.jira.clientId
        },

        {
            name:"JIRA_CLIENT_SECRET",
            value:APP_CONFIG.jira.clientSecret
        },

        {
            name:"JIRA_TOKEN_URL",
            value:APP_CONFIG.jira.tokenUrl
        }

    ];


    const missing =
        required.filter(
            item => !item.value
        );


    if(missing.length > 0){

        throw new Error(
            `Missing environment variables: ${
                missing.map(x=>x.name).join(", ")
            }`
        );

    }


}