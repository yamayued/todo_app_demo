import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// カスタムドメインのルートパスで公開する場合の設定
export default defineConfig({
  plugins: [react()],
  base: '/',
})