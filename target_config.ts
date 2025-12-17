// Конфиг целей: веб (Vite/GitHub Pages) и Tauri build

// В режиме tauriBuild = true фронт ходит по прямому IP к бэкенду
// В режиме tauriBuild = false используется Vite proxy `/api` и относительные пути
export const tauriBuild = true

export const tauriApiBase = 'http://127.0.0.1:8080'


export const webApiBase = ''

export const API_BASE = tauriBuild ? tauriApiBase : webApiBase
