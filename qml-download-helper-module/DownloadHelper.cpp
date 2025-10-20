#include "DownloadHelper.h"
#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QByteArray>
#include <QDebug>
#include <QDirIterator>
#include <QDateTime>

QString detectExtension(const QByteArray &bytes) {
    if (bytes.size() < 4) return "";

    // Convertir les premiers octets en hexadécimal
    QString hex = bytes.toHex().toUpper();

    // Vérifications classiques
    if (hex.startsWith("FFD8FF")) return "jpg";        // JPEG
    if (hex.startsWith("89504E47")) return "png";     // PNG
    if (hex.startsWith("47494638")) return "gif";     // GIF
    if (hex.startsWith("25504446")) return "pdf";     // PDF
    if (hex.startsWith("504B0304")) return "zip";     // ZIP, DOCX, XLSX, ODT (formats ZIP compressés)
    if (hex.startsWith("504B0506") || hex.startsWith("504B0708")) return "zip"; // ZIP vide ou spanned
    
    // Vidéo
    if (hex.startsWith("00000018") || hex.startsWith("00000020") || hex.startsWith("66747970")) return "mp4"; // MP4
    if (hex.startsWith("000001BA") || hex.startsWith("000001B3")) return "mpg"; // MPEG
    if (hex.startsWith("52494646") && hex.mid(8,8) == "41564920") return "avi"; // AVI
    if (hex.startsWith("1A45DFA3")) return "mkv";     // MKV / WebM
    if (hex.startsWith("494433")) return "mp3";       // MP3
    if (hex.startsWith("3026B2758E66CF11")) return "wmv"; // WMV/ASF
    if (hex.startsWith("464C56")) return "flv";       // FLV
    if (hex.startsWith("1A45DFA3")) {                 // WebM ou MKV
        // WebM a un identifiant "webm" dans l'EBML Header
        if (hex.mid(16, 8) == "7765626D") return "webm"; 
        return "mkv"; 
    }
    if (hex.startsWith("1F8B08")) return "gz";        // Gzip
    if (hex.startsWith("424D")) return "bmp";         // BMP
    if (hex.startsWith("49492A00") || hex.startsWith("4D4D002A")) return "tif"; // TIFF
    if (hex.startsWith("000001BA") || hex.startsWith("000001B3")) return "mpg"; // MPEG
    if (hex.startsWith("3026B2758E66CF11")) return "wmv"; // WMV/ASF
    if (hex.startsWith("377ABCAF271C")) return "7z";  // 7-Zip
    if (hex.startsWith("52617221")) return "rar";    // RAR
    if (hex.startsWith("494433")) return "mp3";      // MP3 avec ID3 tag
    if (hex.startsWith("FFFB")) return "mp3";        // MP3 sans ID3 tag
    if (hex.startsWith("4F676753")) return "ogg";    // OGG
    if (hex.startsWith("664C6143")) return "flac";   // FLAC
    if (hex.startsWith("3026B275")) return "asf";    // ASF / WMV / WMA
    if (hex.startsWith("3C3F786D6C")) return "xml";  // XML
    if (hex.startsWith("7B5C727466")) return "rtf";  // RTF
    if (hex.startsWith("3C21444F4354")) return "html"; // HTML
    if (hex.startsWith("2321")) return "sh";         // Script Shell
    if (hex.startsWith("4D5A")) return "exe";        // EXE / DLL / PE
    if (hex.startsWith("CAFEBABE")) return "class";  // Java class

    return "";
}

QString findNewestFileRecursive(const QString &dirPath) {
    QDirIterator it(dirPath, QDir::Files, QDirIterator::Subdirectories);
    QFileInfo newestFile;
    qint64 newestTime = 0;

    while (it.hasNext()) {
        it.next();
        QFileInfo fi = it.fileInfo();
        qint64 mtime = fi.lastModified().toSecsSinceEpoch();
        if (mtime > newestTime) {
            newestTime = mtime;
            newestFile = fi;
        }
    }

    if (!newestFile.exists()) {
        qWarning() << "No File Found in " << dirPath;
        return "";
    }

    return newestFile.absoluteFilePath();
}

void clearCache(const QString &dirPath, const QString &fileToKeep)
{
    QDirIterator it(dirPath, QDir::Files, QDirIterator::Subdirectories);

    while (it.hasNext()) {
        it.next();
        QFileInfo fi = it.fileInfo();

        // Vérifie que le fichier a une extension
        const QString fileName = fi.fileName();
        bool hasExtension = fileName.contains('.') && !fileName.startsWith('.');

        // Ignore if does not have extension or is file to keep
        if (!hasExtension || fi.absoluteFilePath() == fileToKeep)
            continue;

        // Ignore symlinks
        if (fi.isSymLink())
            continue;
        
        // Supprime le fichier
        QFile file(fi.absoluteFilePath());
        if (!file.remove()) {
            qWarning() << "Could not delete" << fi.absoluteFilePath();
        } else {
            qDebug() << "Deleted :" << fi.absoluteFilePath();
        }
    }
}

QString DownloadHelper::getLastDownloaded()
{

    QString dirPath = blob_path;
    QString newestFilePath = findNewestFileRecursive(dirPath);
    clearCache(dirPath,newestFilePath);
    if (newestFilePath.isEmpty())
        return "Error File empty";

    QFile file(newestFilePath);
    if (!file.open(QIODevice::ReadOnly)) {
        return "ERROR Could not open file" ;
    }

    QByteArray header = file.read(4);
    file.close();

    QString ext = detectExtension(header);

    QString targetPath = newestFilePath;
    
    
    if (!ext.isEmpty()) {
        targetPath += "." + ext;
        if (!QFile::copy(newestFilePath, targetPath)) {
            return "Error Impossible to copy file" ;
        }
    }
    
    return targetPath;
}


QString DownloadHelper::get_blob_path() 
{ return blob_path; }
   
void DownloadHelper::set_blob_path(QString value)
{ blob_path = value; }
 


