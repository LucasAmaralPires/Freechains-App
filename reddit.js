#!/usr/bin/node

const input = require('readline-sync');
const Main = require("../Main");
var fs = require("fs");
/*
const crypto = require('crypto-js');

const PUB0 = "47F815A7A0E529CA32E9B40E81CD4E63BBF4852B8993C515003C9C992ACEACAF"

const options_main = `
    Main Menu
    Please, select the number according to the action you want to take:
    1 - Chain Menu
    2 - Close application
`
const options_chain_menu = `
    Chain Menu
    Please, select the number according to the action you want to take:
    1 - Create/Join chain
    2 - Select chain
    3 - Leave chain
    4 - Return to Main Menu
`

const options_select_chain = `
    Select Chain Menu
    Please, select the number according to the action you want to take:
    1 - Post in the chain
    2 - Show previous content in the chain
    3 - Like a message
    4 - Dislike message
    5 - Show reputation amount in chain
    6 - Select another chain
    7 - Return to Chain Menu
`

const options_peer_menu = `
    Friends
`*/

const VERSION = "0.1.0";
const HELP = `
Usage:

    reddit login <username> <password> <?port>

    reddit create subreddit
    reddit join subreddit
    reddit list subreddit
    reddit leave subreddit

    reddit post subreddit
    reddit show subreddit message
    reddit like subreddit message
    reddit dislike subreddit message
    reddit show subreddit reps

    reddit search subreddit
    reddit update
`;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}   

var chains = [];
var num_chains = 0;
var pass_file;

/*

async function chain_menu()
{
    while(true)
    {
        let num_answer = input.question(options_chain_menu);
        if(num_answer === "1")
        {
        }
        else if(num_answer === "2")
        {
            await select_chain()
        }
        else if(num_answer === "3")
        {
            let name_chain = input.question("Please, insert name of the chain you want to leave: ");

            Main.main(["freechains", "chains", "leave", name_chain], () => {})
            await delay(2000);
        }
        else if(num_answer === "4")
        {
            return;
        }
        else console.log("Please insert one of the available numbers.");
    }    
}

/*
async function like_message()
{

}


async function select_chain()
{
    let i = 1;
    Main.main(["freechains", "chains", "list"], function(ans){
        ans = ans.slice(0,-1);
        chains = ans.split(' ');      
    });
    await delay(1000)
    let msn = "Please select chain: \n"
    chains.forEach(element => {
        msn += `${i} - ${element}\n`;
        i += 1;
    });
    while (true)
    {
        num_chains = input.question(msn)-1;
        if (num_chains <= (chains.length-1))
        {
            break;
        }
        else
        {
            console.log("Invalid number");
        }
    }
    while (true) {
        let num_answer = input.question(options_select_chain);
        if (num_answer === "1")
        {
            let msn_post;
            while(true)
            {
                msn_post = input.question("What do you want to post? \n");
                if(msn_post != '') break;
            }
            Main.main(["freechains", "chain", chains[num_chains], "post", "inline", msn_post, `--sign=${pass_file[2]}`], (ans) => {process.stdout.write(ans)});
            await delay(2000);         
        }
        else if (num_answer === "2")
        {
            let block;
            let hash;
            let payload;
            let json_block;
            let j;
            i = 1;
            Main.main(["freechains", "chain", chains[num_chains], "consensus"], (ans) => {hash = ans;});
            await delay(1000);
            hash = hash.slice(0,-1);
            hash = hash.split(' ');
            if(hash.length > 0)
            {
                for(i = 1; i < hash.length; i++)
                {
                    Main.main(["freechains", "chain", chains[num_chains], "get", "payload", hash[i]], (ans) => {payload = ans;});
                    await delay(1000);
                    payload = payload.split('\n');
                    payload.splice(0,1);
                    payload = payload.join('\n');
                    if(payload == '')
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
                    }
                    console.log(`Mensagem ${i}:\n ${payload}`);
                }
            }
            else
            {
                console.log("There are no messages in this chain");
            }
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
        else if (num_answer === "5") //Show Reputation Amount
        {
            return;
        }
        else if (num_answer === "6")
        {
            while (true)
            {
                num_chains = input.question(msn)-1;
                if (num_chains <= (chains.length-1))
                {
                    break;
                }
                else
                {
                    console.log("Invalid number");
                }
            }
        }
        else if (num_answer === "7")
        {
            return;
        }
        else console.log("Please insert one of the available numbers.");
    }
}

async function main_reddit()
{

    while (true) {
        let num_answer = input.question(options_main);
        if(num_answer === "1")
        {
            await chain_menu();
        }
        else if(num_answer === "2") 
        {
        }
        else console.log("Invalid number");
    }
}
*/
async function start()
{
    //COLOCAR O START DEPOIS DE VERIFICAR A SENHA
    let user = input.question("Please insert your username: ");
    Main.main(["freechains-host", "start", `/tmp/${user}`]);
    await delay(1000);

    pass_file = fs.readFileSync(`/tmp/${user}/password.txt`,{ encoding: 'utf8', flag: 'r' });
    pass_file = pass_file.split('\n');
    await delay(1000);

    let password = input.question("Please insert your password: ");
    Main.main(["freechains", "keys", "shared", password], (ans) => {
        if(ans != (pass_file[0] + "\n"))
        {
            console.log("Incorrect password!");
            process.exit();
        }
    });
    await delay(1000);

    Main.main(["freechains", "keys", "pubpvt", password], (ans) => {
        if(ans != (pass_file[1] + " " + pass_file[2] + "\n"))
        {
            console.log("Incorrect password!");
            process.exit();
        }
    });
    await delay(1000);

}

async function create_join()
{
    let name_chain = input.question("Please, insert name of the chain you want to create/join: ");

    Main.main(["freechains", "chains", "join", name_chain, pass_file[1]], () => {})
    await delay(2000);

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
        var js = JSON.parse(fs.readFileSync("config.json"));
        console.log(js);
/*        switch (arg[0])
        {
            case "login":
                break;
            case "update":
                break;
            case "create":
                await create_join();
                break;
            case "join":
                break;
            case "list":
                break;
            case "leave":
                break;
            case "post":
                break;
            case "show":
                break;
            case "dislike":
            case "like":
                break;
            case "search":
                break;
            default:
                console.log("Command not recognized!");
        }*/
    }
}
//main_reddit();

main(process.argv.slice(2));