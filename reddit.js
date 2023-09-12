#!/usr/bin/node

const Main = require("../Main");
var fs = require("fs");

const VERSION = "0.1.0";
const HELP = `
Usage:

    reddit login    <username>  <password>  <?port>
    reddit logoff

    reddit create   <subreddit>
    reddit join     <subreddit>
    reddit leave    <subreddit>
    reddit list
    reddit select   <subreddit>
    
    reddit post     <message>
*    reddit like     <number_message>
*    reddit dislike  <number_message>
*    reddit show     

*    reddit search subreddit
*    reddit update
`;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}   

var js;

/*
async function select_chain()
{
    while (true) {
        else if (num_answer === "2")
        {
        }
        else if (num_answer === "3") //Like
        {
//            Main.main(["freechains", "chain", chains[num_chains], "like", hash[i]], (ans) => {block = ans;});
                        
            return;
        }
        else if (num_answer === "4") //Dislike
        {
//            Main.main(["freechains", "chain", chains[num_chains], "dislike", hash[i]], (ans) => {block = ans;});

            return;
        }
    }
}
*/
async function show(arg)
{
    let block;
    let hash;
    let payload;
    let json_block;
    let j;
    i = 1;
    Main.main(["freechains", "chain",  `#${js.username[js.current_select].select_subreddit}`, "consensus", `--port=${js.username[js.current_select].port}`], (ans) => {hash = ans;});
    await delay(1000);
    hash = hash.slice(0,-1);
    hash = hash.split(' ');
    if(hash.length > 1)
    {
        for(i = 1; i < hash.length; i++)
        {
            Main.main(["freechains", "chain",  `#${js.username[js.current_select].select_subreddit}`, "get", "payload", hash[i], `--port=${js.username[js.current_select].port}`], (ans) => {payload = ans;});
            await delay(1000);
            payload = payload.split('\n');
            payload.splice(0,1);
            payload = payload.join('\n');
/*            if(payload == '')
            {
                Main.main(["freechains", "chain", chains[num_chains], "get", "block", hash[i]], (ans) => {block = ans;});
                await delay(1000);

                block = block.split('\n');
                block.splice(0,1);
                block = block.join('\n');

                json_block = JSON.parse(block);
                if(json_block.like.n == 1)
                {
                    for(j = 0; j < hash.length;j++)
                    {
                        if (json_block.like.hash == hash[j])
                        {
                            payload = `Mensagem ${j} recebeu um like`;
                            break;
                        }
                    }
                }
            }*/
            console.log(`Mensagem ${i}:\n ${payload}`);
        }
    }
    else
    {
        console.log("There are no messages in this chain");
    }
}

async function like(arg)
{
//    if(js.username[js.current_select].select_subreddit == "")
 //   {
  //      console.log("Select a subreddit first.");
   // }
    console.log(arg);
}

async function start(arg)
{
    let i;

    js = {
        "user": arg[1],
        "password": [
          "41783E6207C61E0ED6499C7EE800897E2930610623C3EDFAA8EE8F6ADE1593B5",
          "DAF8C7C6A5B1127624007983F1A3235042F7382E9E1D859D9949E19A99DA528341783E6207C61E0ED6499C7EE800897E2930610623C3EDFAA8EE8F6ADE1593B5"
        ],
        "port": "8330",
        "subreddits": [],
        "select_subreddit": ""
      };

    for(i = 0; i < js.username.length; i++)
    {
        if(arg[1] == js.username[i].user)
        {
            Main.main(["freechains", "keys", "pubpvt", arg[2], `--port=${js.username[i].port}`], (ans) => {
                if(ans != (js.username[i].password[0] + " " + js.username[i].password[1] + "\n"))
                {
                    console.log("Incorrect password!");
                    process.exit();
                }
            });
            await delay(1000);

            if(arg[3] != undefined)
            {
                js.username[i].port = arg[3];
            }
          
            js.current_select = i;

            console.log("Log in successful")

            break;
        }
    }
    fs.writeFileSync("config.json", JSON.stringify(js, null, 2));                
}

async function leave(arg)
{
    let j;
    for (j = 0; j < js.username[js.current_select].subreddits.length; j++)
    {
        if (arg[1] == js.username[js.current_select].subreddits[j])
        {
            Main.main(["freechains", "chains", "leave", `#${arg[1]}`, `--port=${js.username[js.current_select].port}`], () => {
                console.log("Left subreddit");
            })
            await delay(2000);
            js.username[js.current_select].subreddits.splice(j,j);
            break;   
        }
        else if(j == js.username[js.current_select].subreddits.length-1)
        {
            console.log("Subreddit not found");
        }
    }

}

async function post(arg)
{
    if(js.username[js.current_select].select_subreddit == "")
    {
        console.log("Select a subreddit first.");
    }
    else
    {
        Main.main(["freechains", "chain", `#${js.username[js.current_select].select_subreddit}`, "post", "inline", arg[1], `--sign=${js.username[js.current_select].password[1]}`, `--port=${js.username[js.current_select].port}`], (ans) => {process.stdout.write(ans)});
        await delay(2000);         
    }

}

async function select(arg)
{
    let j;
    for (j = 0; j < js.username[js.current_select].subreddits.length; j++)
    {
        if (arg[1] == js.username[js.current_select].subreddits[j])
        {
            js.username[js.current_select].select_subreddit = js.username[js.current_select].subreddits[j];
            console.log(`${arg[1]} selected.`);
            break;   
        }
        else if(j == js.username[js.current_select].subreddits.length-1)
        {
            console.log("Subreddit not found");
        }
    }


}

async function create_join(arg)
{

    Main.main(["freechains", "chains", "join", `#${arg[1]}`, js.username[js.current_select].password[0], `--port=${js.username[js.current_select].port}`], () => {
           console.log("Subreddit created/joined!");
    })
    await delay(2000);
    js.username[js.current_select].subreddits.push(arg[1]);

}

async function main(arg)
{
    if ((arg[0] == null) || (arg[0] == "help") || (arg[0] == "--help"))
    {
        console.log(HELP);
    }
    else if ((arg[0] == "version") || (arg[0] == "--version"))
    {
        console.log(VERSION);
    }
    else
    {
        try
        {
            js = JSON.parse(fs.readFileSync("config.json"));
//        console.log(js);

        }
        catch(err)
        {
            if(arg[0] == "login")
            {
                if(arg.length < 3 || arg.length > 4)
                {
                    console.log("Wrong number of arguments.");
                }
                else
                {
                    await start(arg);
                }
            }
            else
            {
                console.log("You must first login before using reddit!");
            }
        }
/*
        if (js.login == false && arg[0] != "login")
        {
            console.log("You must first login before using reddit!");
        }
        else
        {
            let s_like = "like"
            switch (arg[0])
            {
                case "login":
                    if(arg.length < 3 || arg.length > 4)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await start(arg);
                    }
                    break;
                case "logoff":
                    if(arg.length != 1)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        js.username[js.current_select].select_subreddit = "";
                        js.current_select = 0; 
                        js.login = false;
                    }
                    break;
                case "join":
                case "create":
                    if(arg.length != 2)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await create_join(arg);
                    }
                    break;
                case "list":
                    if(arg.length != 1)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        js.username[js.current_select].subreddits.forEach(function(entry) {
                            console.log(entry);
                        });
                    }
                    break;
                case "leave":
                    if(arg.length != 2)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await leave(arg);
                    }
                    break;
                case "select":
                    if(arg.length != 2)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await select(arg);
                    }
                    break;
                case "post":
                    if(arg.length != 2)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await post(arg);
                    }
                    break;
                case "show":
                    if(arg.length != 1)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await show(arg);
                    }
                    break;
                case "dislike":
                    s_like = "dislike";                
                case "like":
                    arg.push(s_like);
                    if(arg.length != 3)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        await like(arg);
                    }                    
                    break;
                case "search":
                    break;
                case "update":
                    break;
                default:
                    console.log("Command not recognized!");
            }
        }
        fs.writeFileSync("config.json", JSON.stringify(js, null, 2));
*/
    }
}

main(process.argv.slice(2));