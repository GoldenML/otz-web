
const getApi = function (path) {
    return `/otz/im/web_proxy/${path}`
}

const otz = {
    SEND_VERIFY_CODE: getApi('verify_code'),
    USER_LOGIN: getApi('login'),
    USER_GET_INFO: getApi('get_user_info'),
    USER_GET_FRIEND: getApi('get_user_friends'),
}

export default otz
