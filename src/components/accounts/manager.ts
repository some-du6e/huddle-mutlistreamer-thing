const accountsFileName = process.env.ACCOUNT_FILE || "accounts.json"
import type { Account, SlackAuthTestResponse } from "../../types";


export async function getAccount() { // todo: if this is still here then im a dumbass
    const accountsFile = Bun.file(accountsFileName)
    const accounts = await accountsFile.json()

    const account = accounts.user1
    if (!account.userId) {
        const authInfo = await fetch("https://slack.com/api/auth.test").then(res => res.json()) as SlackAuthTestResponse
        account.userId = authInfo
    } 
    return account as Account
}