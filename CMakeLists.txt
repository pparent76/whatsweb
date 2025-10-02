cmake_minimum_required(VERSION 3.5)
project(whatsweb C CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

#Notification module
add_subdirectory(qml-notify-module)

# Installer le QML + manifest + apparmor
install(DIRECTORY app/ DESTINATION ${CMAKE_INSTALL_PREFIX}/app/)
install(FILES ${PROJECT_NAME}.apparmor DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES ${PROJECT_NAME}.desktop DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES content-hub.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES icon.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES icon-splash.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES manifest.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES push.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES push-apparmor.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES pushexec DESTINATION ${CMAKE_INSTALL_PREFIX})
