import { getAccount } from "./components/accounts/manager";
import { impersonateUser} from "./components/impersonation";

const account = await getAccount()

impersonateUser(account, "U082DRXPMF1")