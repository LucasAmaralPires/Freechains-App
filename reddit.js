const Main = require("../Main");
const input = require('readline-sync');

const options_main = `
    Main Menu
    Please, select the number according to the action you want to take:
    1 - Select a chain
    2 - Close application
`
const options_select_chain = `
    Chain Menu
    Please, select the number according to the action you want to take:
    1 - Post in the chain
    2 - Show previous content in the chain
    3 - Select another chain
    4 - Return to Main Menu
`

var chains = [];
var num_chains = 0;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
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
            let msn_post = input.question("What do you want to post? \n");
            Main.main(["freechains", "chain", chains[num_chains], "post", "inline", msn_post], (ans) => {process.stdout.write(ans)});
            await delay(2000);         
        }
        else if (num_answer === "2")
        {
            let block;
            let hash;
            let i,j;
            let payload = [];
            let json_block;
            Main.main(["freechains", "chain", chains[num_chains], "heads"], (ans) => {hash = ans;});
            await delay(1000);
            hash = hash.slice(0,-1);
            let num_msn = hash[0];
            for (i = 0; i < num_msn; i++)
            {
                Main.main(["freechains", "chain", chains[num_chains], "get", "block", hash], (ans) => {block = ans;});
                await delay(1000);
                Main.main(["freechains", "chain", chains[num_chains], "get", "payload", hash], (ans) => {payload.push(ans);});
                await delay(1000);

                payload[i] = payload[i].split('\n');
                payload[i].splice(0,1);
                payload[i] = payload[i].join('\n');

                block = block.split('\n');
                block.splice(0,1);
                block = block.join('\n');

                json_block = JSON.parse(block);
                hash = json_block.backs[0];
            }
            for (i = num_msn-1, j = 1; i >= 0; i--, j++)
            {
                console.log(`Mensagem ${j}:\n ${payload[i]}`);
            }
        }
        else if (num_answer === "3")
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
        else if (num_answer === "4")
        {
            return;
        }
        else console.log("Please insert one of the available numbers.");
    }
}

async function main_reddit()
{
    let user = input.question("Please insert your username: ");
    Main.main(["freechains-host", "start", `/tmp/${user}`]);
    await delay(1000)

    while (true) {
        let num_answer = input.question(options_main);
        if(num_answer === "1")
        {
            await select_chain()
        }
        else if(num_answer === "2") 
        {
            Main.main(["freechains-host", "stop"],() => {});
            await delay(1000);    
            process.exit();
        }
        else console.log("Invalid number");
    }
}

main_reddit();