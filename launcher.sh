#!/bin/sh

enableGPU=true;

while read p; do
  if [ "$p" = "enableGpu=false" ]; then
  enableGPU="false";
  fi
done < /home/phablet/.config/whatsweb.pparent/whatsweb.pparent.conf

if [ "$enableGPU" = "true" ]; then
    export QTWEBENGINE_CHROMIUM_FLAGS=""
    exec qmlscene %u -I qml-plugins/ app/Main.qml  --scaling --gles
else
    export QTWEBENGINE_CHROMIUM_FLAGS="--disable-gpu"
    exec qmlscene %u -I qml-plugins/ app/Main.qml  --scaling --disable-gpu --software
fi
