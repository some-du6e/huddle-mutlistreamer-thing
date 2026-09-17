const accountsFileName = process.env.ACCOUNT_FILE || "accounts.json"
import type { Account } from "../../types";


export async function getAccount() { // todo: if this is still here then im a dumbass
    const accountsFile = Bun.file(accountsFileName)
    const accounts = await accountsFile.json()

    const account = accounts.user1 as Account
    return account
}