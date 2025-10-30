#!/bin/sh

enableGPU=false;

while read p; do
  if [ "$p" = "enableGpu=true" ]; then
  enableGPU="true";
  fi
done < /home/phablet/.config/whatsweb.pparent/whatsweb.pparent.conf

if [ "$enableGPU" = "true" ]; then
    export QTWEBENGINE_CHROMIUM_FLAGS=""
    exec qmlscene %u -I qml-plugins/ app/Main.qml  --scaling --gles
else
    export QTWEBENGINE_CHROMIUM_FLAGS="--disable-gpu"
    exec qmlscene %u -I qml-plugins/ app/Main.qml  --scaling --disable-gpu --software
fi
