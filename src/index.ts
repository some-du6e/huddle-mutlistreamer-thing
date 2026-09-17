import { joinChannelHuddle } from "./components/huddles/join"
import { getAccount } from "./components/accounts/manager"

const account = await getAccount()

joinChannelHuddle("C0C2NJR0JQN", account).then((res) => {
    console.log(res)
    
})
