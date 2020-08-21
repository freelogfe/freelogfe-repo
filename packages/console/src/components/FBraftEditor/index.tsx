import * as React from 'react';
import styles from './index.less';
import BraftEditor, {BraftEditorProps, EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';
import {uploadImage, UploadImageParamsType} from "@/services/storages";
import {connect} from "dva";
import {ConnectState, GlobalModelState} from "@/models/connect";

interface FBraftEditorProps extends BraftEditorProps {
  global: GlobalModelState;
}

function FBraftEditor({global, ...props}: FBraftEditorProps) {

  return (
    <BraftEditor
      {...props}
      language={global.locale === 'en-US' ? 'en' : 'zh'}
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link', 'fullscreen']}
      media={{
        async uploadFn(fileParams) {
          const params: UploadImageParamsType = {
            file: fileParams.file,
          };
          const {data} = await uploadImage(params);
          // fileParams.progress();
          fileParams.success({
            url: data.url,
            meta: {
              id: data.url,
              title: '',
              alt: '',
              loop: false,
              autoPlay: false,
              controls: false,
              poster: '',
            }
          });
        },
        validateFn(file) {
          return true;
        },
        accepts: {
          // image?: string | false;
          video: false,
          audio: false,
        },
        externals: {
          image: true,
          video: false,
          audio: false,
          embed: false,
        },
        // pasteImage: true,
      }}
    />
  );
}


export default connect(({global}: ConnectState) => ({
  global: global,
}))(FBraftEditor);
