cmake_minimum_required(VERSION 3.5)
project(whatsweb C CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

#Notification module
add_subdirectory(qml-notify-module)
add_subdirectory(qml-download-helper-module)

# Installer le QML
install(DIRECTORY app/ DESTINATION ${CMAKE_INSTALL_PREFIX}/app/)
# Installer les fichier de lancement
install(FILES ${PROJECT_NAME}.apparmor DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES ${PROJECT_NAME}.desktop DESTINATION ${CMAKE_INSTALL_PREFIX})
# Installer les icones
install(FILES icon.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES icon-splash.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES manifest.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(PROGRAMS pushexec DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES whatsweb-push-helper.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES whatsweb-push.apparmor DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES push-apparmor.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES content-hub.json DESTINATION ${CMAKE_INSTALL_PREFIX})

