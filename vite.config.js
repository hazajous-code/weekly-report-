import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base를 './' 상대경로로 두어 저장소 이름과 무관하게 GitHub Pages에서 동작합니다.
export default defineConfig({
  plugins: [react()],
  base: './',
})
