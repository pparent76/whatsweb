import QtQuick 2.15
import Ubuntu.Components 1.3

Row {
    id: root
    property string text: "Option"
    property int value 
    property int minimumValue: 0
    property int maximumValue: 1000
    property int stepSize: 1

    width: parent ? parent.width : units.gu(40)
    spacing: units.gu(1)
    anchors.horizontalCenter: parent ? parent.horizontalCenter : undefined
    leftPadding: units.gu(5)

    Label {
        id:label
        text: root.text
        width: units.gu(20)
        verticalAlignment: Text.AlignVCenter
        color: "#000000"
    }

    Button {
        text: "-"
         width: units.gu(3)
        onClicked: {
            if (root.value - root.stepSize >= root.minimumValue) {
                root.value -= root.stepSize
                root.valueChanged(root.value)
            }
        }
    }

    TextEdit {
        text: root.value.toString()
        width: units.gu(8)
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        color: "#000000"
    }

    Button {
        text: "+"
        width: units.gu(3)
        onClicked: {
            if (root.value + root.stepSize <= root.maximumValue) {
                root.value += root.stepSize
                root.valueChanged(root.value)
            }
        }
    }

    height: Math.max(label.implicitHeight, Button.implicitHeight) + units.gu(1)
}
