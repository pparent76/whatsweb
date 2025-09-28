cmake_minimum_required(VERSION 3.5)
project(whatsweb C CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Qt5 modules
find_package(Qt5 5.9 REQUIRED COMPONENTS Core Gui Qml Quick DBus)

# libnotify et glib
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBNOTIFY REQUIRED libnotify)

# Sources
file(GLOB_RECURSE APP_SOURCES
    resource.qrc
    src/*.cpp
    src/*.h
)

# Executable
add_executable(${PROJECT_NAME}
    ${APP_SOURCES}  
)


# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${LIBNOTIFY_INCLUDE_DIRS}
    src
)

# Compile flags
target_compile_options(${PROJECT_NAME} PRIVATE ${LIBNOTIFY_CFLAGS} ${GLIB2_CFLAGS})

# Link libraries
target_link_libraries(${PROJECT_NAME} PRIVATE
    Qt5::Core
    Qt5::Gui
    Qt5::Qml
    Qt5::Quick
    Qt5::DBus    
    ${LIBNOTIFY_LIBRARIES}
    ${GLIB2_LIBRARIES}
)

# Install binary
install(TARGETS ${PROJECT_NAME} RUNTIME DESTINATION ${CMAKE_INSTALL_PREFIX}/bin)

# Installer le QML + manifest + apparmor
install(DIRECTORY src/qml/ DESTINATION ${CMAKE_INSTALL_PREFIX}/)
install(FILES ${PROJECT_NAME}.apparmor DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES ${PROJECT_NAME}.desktop DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES content-hub.json DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES icon.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES icon-splash.png DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES manifest.json DESTINATION ${CMAKE_INSTALL_PREFIX})
