
const getApi = function (path) {
    return `/otz/im/web_proxy/${path}`
}

const otz = {
    USER_LOGIN_STATUS: getApi('login_status'),
    SEND_VERIFY_CODE: getApi('verify_code'),
    USER_LOGIN: getApi('login'),
    USER_GET_INFO: getApi('get_user_info'),
    USER_GET_FRIEND: getApi('get_user_friends'),
    USER_ADD_FRIEND: getApi('add_friend'),
    USER_GET_MSGS: getApi('get_user_msgs')
}

export default otz
