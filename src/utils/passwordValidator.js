export const passwordValidator = (password) => {
    const pattern = /[a-zA-Z0-9_@#$%^&*()+~!-]/g
    if (password.length<8) {
        return 'Длина пароля должна быть не менее 8 символов'
    }
    if (password.match(pattern).join('') !== password) {
        return 'Пароль может содержать только цифры, буквы английского алфавита и символы (_@#$%^&*()+~!-)'
    }
    return true
}