export const API_ENDPOINT = {
  AUTH: {
    LOGIN: "/login/login.php",
    VERIFYAUTH: "/login/login_verify.php",
  },
  
  DASHBOARD: {
    DASHBOARD: "/dashboard/dashboard.php",
    TICKET_ASSIGN: "/dashboard/ticket_asign.php",
  },

  USERS: {
    USERLIST: "/user/list_all_user.php",
    ADMINACTION: "/user/user_action.php",
    LISTMT5USER: "/user/list_all_mt5_user.php",
    GET_MT5_ACCOUNT_DETAILS: "/user/get_mt5_account_details.php",
    CHANGE_MT5_PASSWORD: "/user/change_mt5_password.php",
    GET_MT5_ACCOUNT_BY_EMAIL: "/user/get_mt5_account_by_email.php",
    GET_USERNAME_BY_EMAIL: "/user/get_username_by_email.php",
    CREATE_MT5_ACCOUNT: "/user/create_mt5_account.php",
    GET_USERNAME_BY_ACCOUNTNO: "/user/get_username_by_accountno.php",
    CHANGE_MT5_LEVERAGE: "/user/change_mt5_leverage.php",
    SEND_VERIFICATION_MAIL_MT5: "/user/send_verification_mail_mt5.php",
    MT5_MAIN_PASSWORD_REQUEST_LIST: "/user/mt5_main_password_request_list.php",
    CHANGE_MT5_MAIN_PASSWORD_REQUEST_LIST: "/user/change_mt5_main_password_action.php",
    GET_USER_DETAILS: "/user_details/get_user_details.php",
    IB_DETAILS: "/user_details/ib_details.php",
    LIVE_TRADE: "/user_details/live_trade.php",
    TRADING_REPORT: "/user_details/trading_report.php",
  },

  USER_KYC: {
    UPLOAD_NEW_KEY_LIST: "/kyc/upload_new_kyc_list.php",
    NEW_KYC_LIST_APPROVE: "/kyc/upload_new_kyc_list_approved.php",
    NEW_BANK_KYC_LIST: "/kyc/upload_bank_list.php",
    ACCEPTED_BANK_KYC: "/kyc/upload_bank_list_accepted.php",
    REJECTED_BANK_HISTORY: "/kyc/upload_bank_list_history.php",
    REJECTED_KYC_HISTORY: "/kyc/upload_new_kyc_list_history.php",
    ADD_BANK_ACCOUNT: "/kyc/upload_bank_add.php",
    UPDATE_KYC_STATUS: "/kyc/update_kyc_status.php",
    UPDATE_BANK_KYC_STATUS: "/kyc/update_bank_kyc_status.php",
  },

  TRANSACTION: {
    CREATE_DEPOSIT_CLIENT: "/transaction/create_deposit_client.php",
    CREATE_WITHDRAWAL_CLIENT: "/transaction/create_withdraw_client.php",
  },

  INTERNAL_TRANFER: {
    INTERNAL_TRANSACTION: "/internal_transfer/internal_transfer.php",
  },

  IB_MANAGEMENT: {
    IB_WITHDRAWAL_REQUEST_LIST: "/ib/ib_withdrawal_req_list.php",
    IB_WITHDRAWAL_ACTION: "/ib/ib_withdrawal_action.php",
    IB_WITHDRAWAL_REJECT: "/ib/ib_withdrawal_reject.php",
    IB_WITHDRAWAL_ACCEPT: "/ib/ib_withdrawal_accept.php",
    IB_REWARD_LIST: "/ib/reward_list.php",
    IB_LIST: "/ib/ib_list.php",
    IB_LEVEL_LIST: "/ib/ib_level_list.php",
    IB_LEVELWISE_USER_DETAIL: "/ib/ib_levelwise_user_detail.php",
    IB_LIST_COMMISSION: "/ib/ib_list_commission.php",
    IB_LIST_APPROVED: "/ib/ib_list_approved.php",
    IB_LIST_APPROVED_DEACTIVE: "/ib/ib_action.php",
    IB_LIST_PENDING: "/ib/ib_list_pending.php",
    IB_LIST_REJECT: "/ib/ib_list_reject.php",
    IB_MOVE: "/ib/ib_move.php ",
  },

  // EXCHANGER: {
  //   EXCHANGER_EDIT: "/exchanger/settlement_edit.php",
  // },

  BANK_INFO: {
    ADD_BANK: "/bank_info/edit_company_bank_details.php",
  },

  GROUPS: {
    LISTGROUP: "/group/list_group.php",
    CREATE_MT5_GROUP: "/group/create_mt5_group.php",
    EDIT_MT5_GROUP: "/group/edit_mt5_group.php",
    UPDATE_MT5_GROUP: "/group/update_mt5_group.php",
  },

  WALLET_REQUEST: {
    LIST_WALLET_REQUEST: "/wallet/wallet_req_list.php",
    WALLET_ACCEPT_LIST: "/wallet/wallet_accept_list.php",
    WALLET_REJECT_LIST: "/wallet/wallet_reject_list.php",
    WALLET_ACTION: "/wallet/wallet_action.php",
  },

  WITHDRAWAL_REQUEST: {
    WITHDRAWAL_REQUEST_LIST: "/withdrawal/withdrawal_req_list_final_trx.php",
    WITHDRAWAL_ACCEPT_LIST: "/withdrawal/withdrawal_accept_list.php",
    WITHDRAWAL_REJECT_LIST: "/withdrawal/withdrawal_reject_list.php",
    WITHDRAWAL_ACTION: "/withdrawal/withdrawal_action.php",
  },

  WITHDRAWAL_INFO: {
    GET_WITHDRAW_INFO: "/withdrawal_info/get_withdraw_info.php",
    ADD_WITHDRAW_INFO: "/withdrawal_info/add_withdraw_info.php",
  },

  GAS_INFO: {
    GET_GAS_INFO: "/gas_info/get_gas_info.php",
    ADD_GAS_INFO: "/gas_info/add_gas_info.php",
  },

  DEPOSIT_WALLET: {
    GET_DEPOSIT_WALLET: "/deposit_wallet/get_deposit_wallet.php",
    ADD_DEPOSIT_WALLET: "/deposit_wallet/add_deposit_wallet.php",
  },

  COUNTRY: {
    COUNTRY_LIST: "/country/get_country.php",
    // COUNTRY_LIST: "/user/list_all_user_old.php",
  },
  REPORTS: {
    WALLET_REPORT: "/reports/wallet_history.php",
    INTERNAL_TRANSFER_REPORT: "/reports/internal_transfer_report.php",
    WALLET_REQUEST_LIST_HISTORY: "/reports/wallet_req_list_history.php",
    WITHDRAWAL_REQUEST_LIST_HISTORY: "/reports/withdrawal_req_list_history_trx.php",
    WITHDRAWAL_REQUEST_LIST_HISTORY_IB: "/reports/withdrawal_req_list_history_ib.php",
  },

  NOTIFICATION: {
    GET_ALL_NOTIFICATION: "/notification/get_all_notification.php",
    READ_NOTIFICATION_BY_ID: "/notification/read_notification_by_id.php",
    READ_ALL_NOTIFICATION: "/notification/read_all_notification.php",
    UNREAD_USER_LOG: "/notification/unread_user_log.php",
    READ_USER_LOG: "/notification/read_user_log.php",
    READ_LOG_ACTION: "/notification/readlog.php",
    ADMIN_LOGIN_LOG: "/notification/user_admin_login_log.php",
    USER_LOGIN_LOGS: "/notification/user_login_logs.php",
  },

  SUPPORT_TICKET: {
    OPEN_TICKET_LIST: "/support/running_support_ticket_list.php",
    CLOSE_TICKET_LIST: "/support/close_support_ticket_list.php",
    TICKET_DETAILS: "/support/admin_support_details.php",
    REPLY_TICKET: "/support/admin_reply_support_ticket.php",
    // REPLY_TICKET: "/user/list_all_user_old.php",
  },

  STAFFLIST: {
    ADMIN_STAFF_LIST: "/staff/list_employee.php",
    GET_ALL_PERMISSION: "/staff/get_all_permission.php",
    ADD_NEW_EMPLOYEE: "/staff/add_new_employee.php",
    EDIT_EMPLOYEE_DETAILS: "/staff/edit_employee.php",
    DELETE_EMPLOYEE_DETAILS: "/staff/delete_employee.php",
  },

  BOUNS: {
    BOUNS_LIST: "/user/list_bonus.php",
    DISCOUNT_LIST: "/user/discount_list.php",
    GIVE_BOUNS: "/user/give_bonus.php",
    REMOVE_WALLET: "/user/remove_bonus.php",
    CANCEL_DISCOUNT: "/user/cancel_discount.php",
  },
};
