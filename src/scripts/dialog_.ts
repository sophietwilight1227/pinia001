import { createApp } from "vue";
import Dialog from "@/components/Dialog.vue";

/** 動的なコンポーネントの追加 */
export function addComponentDynamically (props = {}) {
  const app = createApp(Dialog, props);
  const wrapper = document.createElement('div');

  app.mount(wrapper);
  document.body.appendChild(wrapper);

}

/** 動的なコンポーネントの削除 */
function removeComponentDynamically (app: any, wrapper: any) {
  app.unmount();
  wrapper.remove();
}