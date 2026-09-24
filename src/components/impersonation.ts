import type { Account, CachetUserResult, PreparePhotoResponse } from "../types"

function setBotName(acc: Account, newDisplayName: string, newFullName: string) {
    const formData = new FormData()

    formData.append("token", acc.xoxcToken)
    formData.append(
        "profile",
        JSON.stringify({
            display_name: `[MS] ${newDisplayName}`,
            real_name: `[MS] ${newFullName}`,
        }),
    )

    fetch("https://hackclub.enterprise.slack.com/api/users.profile.set", {
        headers: {
            cookie: `d=${acc.xoxdToken}`,
        },
        body: formData,
        method: "POST",
    })
}

async function setBotProfilePicture(acc: Account, imageUrl: string) {
    const formData = new FormData()

    formData.append("token", acc.xoxcToken)

    const blobbedImage = await fetch(imageUrl).then(res => res.blob())
    formData.append("image", blobbedImage, "blob")


    const probablyVeryImportantInfo = await fetch("https://hackclub.enterprise.slack.com/api/users.preparePhoto", {
        headers: {
            cookie: `d=${acc.xoxdToken}`,
        },
        body: formData,
        method: "POST",
    }).then(res => res.json()) as PreparePhotoResponse

    const probablyVeryImportantId = probablyVeryImportantInfo.id

    const setPhotoFormData = new FormData()
    setPhotoFormData.append("token", acc.xoxcToken)
    setPhotoFormData.append("id", probablyVeryImportantId)

    fetch("https://hackclub.enterprise.slack.com/api/users.setPhoto", {
        headers: {
            cookie: `d=${acc.xoxdToken}`,
        },
        body: setPhotoFormData,
        method: "POST",
    })



}

function getUserInfo(slackId: string) {
    return fetch(`https://cachet.hackclub.com/users/${slackId}`)
        .then(res => res.json())
        .then(data => data as CachetUserResult)
}




function setBotManager(acc: Account, manager: string) {
    const formData = new FormData()

    formData.append("token", acc.xoxcToken)
    formData.append("user", acc.userId)

    formData.append("section", "Ps09U8V7S7GE")
    formData.append("elements", JSON.stringify([
        {
            "element_id": "Pe09V7JMRG4S",
            "person": {"persons":[manager]}
        }
    ]))


    fetch("https://hackclub.enterprise.slack.com/api/users.profile.setSections", {
        headers: {
            cookie: `d=${acc.xoxdToken}`,
        },
        body: formData,
        method: "POST",
    })
}

export async function impersonateUser(acc: Account, slackId: string) {
    const impersonated = await getUserInfo(slackId)
    console.log(impersonated)
    setBotName(acc, impersonated.displayName, impersonated.realName)
    setBotProfilePicture(acc, impersonated.imageUrl)
    setBotManager(acc, slackId)

}
