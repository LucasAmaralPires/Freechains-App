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

var js = {};

async function show(arg)
{
    let block;
    let hash;
    let payload;
    let json_block;
    let j;
    i = 1;
    Main.main(["freechains", "chain",  `#${js.select_subreddit}`, "consensus", `--port=${js.port}`], (ans) => {hash = ans;});
    await delay(1000);
    hash = hash.slice(0,-1);
    hash = hash.split(' ');
    if(hash.length > 1)
    {
        for(i = 1; i < hash.length; i++)
        {
            Main.main(["freechains", "chain",  `#${js.select_subreddit}`, "get", "payload", hash[i], `--port=${js.port}`], (ans) => {payload = ans;});
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

async function start(arg, pass)
{
    let i;

    js;

    js.user = arg[1];
    js.select_subreddit = "";

    if(arg[3] != undefined)
    {
        js.port = arg[3];
    }
    else
    {
        js.port = 8330;
    }
  
    Main.main(["freechains", "keys", "pubpvt", arg[2], `--port=${js.port}`], (ans) => {
        Main.main(["freechains", "chains", "list", `--port=${js.port}`], (ans_create) => {
                ans = ans.slice(0,-1);
                ans = ans.split(' ');
                ans_create = ans_create.slice(0,-1);
                ans_create = ans_create.split(' ');
                js.subreddits = ans_create;
                js.password = ans;
            });
        });
    await delay(3000);

    console.log("Log in successful")
    
    fs.writeFileSync("config.json", JSON.stringify(js, null, 2));                
}

async function leave(arg)
{
    let j;
    for (j = 0; j < js.subreddits.length; j++)
    {
        if (arg[1] == js.subreddits[j])
        {
            Main.main(["freechains", "chains", "leave", `#${arg[1]}`, `--port=${js.port}`], () => {
                console.log("Left subreddit");
            })
            await delay(2000);
            js.subreddits.splice(j,j);
            break;   
        }
        else if(j == js.subreddits.length-1)
        {
            console.log("Subreddit not found");
        }
    }

}

async function post(arg)
{
    if(js.select_subreddit == "")
    {
        console.log("Select a subreddit first.");
    }
    else
    {
        Main.main(["freechains", "chain", `#${js.select_subreddit}`, "post", "inline", arg[1], `--sign=${js.password[1]}`, `--port=${js.port}`], (ans) => {process.stdout.write(ans)});
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

    Main.main(["freechains", "chains", "join", `#${arg[1]}`, js.password[0], `--port=${js.port}`], () => {
           console.log("Subreddit created/joined!");
    })
    await delay(2000);
    js.subreddits.push(arg[1]);

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
/*        try
        {

            js = JSON.parse(fs.readFileSync("config.json"));

        }
        catch (err)
        {

        }*/

        if(js[0] != undefined && arg[0] != "login")
        {
            console.log("You must first login before using reddit!");
            process.exit();
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
                        await start(arg, js);
                    }
                    break;
                case "logoff":
                    if(arg.length != 1)
                    {
                        console.log("Wrong number of arguments.");
                    }
                    else
                    {
                        fs.unlinkSync("config.json");
                     //   fs.writeFileSync("config.json", JSON.stringify(js.password, null, 2));                
                        process.exit();
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
                        js.subreddits.forEach(function(entry) {
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
    }
}

main(process.argv.slice(2));