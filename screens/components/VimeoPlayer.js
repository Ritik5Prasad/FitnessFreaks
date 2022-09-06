import React from "react";
import { string, func } from "prop-types";
import WebView from "react-native-autoheight-webview";

function VimeoPlayer({ videoId, onError }) {
  return (
    <WebView
      style={style}
      onError={onError}
      allowsFullscreenVideo
      scrollEnabled={false}
      automaticallyAdjustContentInsets
      source={{
        html: `
          <html>
            <body>
              <iframe src="https://player.vimeo.com/video/${videoId}" width="100%" height="200px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
              <script src="https://player.vimeo.com/api/player.js"></script>
            </body>
          </html>
        `,
      }}
    />
  );
}

const style = {
  maxWidth: "100%",
};

VimeoPlayer.propTypes = {
  videoId: string,
  onError: func,
};

export default VimeoPlayer;
