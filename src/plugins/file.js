// TODO: add functionality to define storage size in the getFilesystem() -> requestFileSystem() method
// TODO: add documentation for FileError types
// TODO: add abort() option to downloadFile and uploadFile methods.
// TODO: add support for downloadFile and uploadFile options. (or detailed documentation) -> for fileKey, fileName, mimeType, headers
// TODO: add support for onprogress property


angular.module('ngCordova.plugins.file', [])

//Filesystem (checkDir, createDir, checkFile, creatFile, removeFile, writeFile, readFile)
  .factory('$cordovaFile', ['$q', function ($q) {

    return {
      checkDir: function (dir) {
        var q = $q.defer();

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getDirectory(dir, {create: false},
              //Dir exists
              function () {
                q.resolve();
              },
              //Dir doesn't exist
              function () {
                q.reject();
              }
            );
          }
        );

        return q.promise;
      },

      createDir: function (dir, replaceBOOL) {
        var q = $q.defer();

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getDirectory(dir, {create: true, exclusive: replaceBOOL},
              //Dir exists or is created successfully
              function () {
                q.resolve();
              },
              //Dir doesn't exist and is not created
              function () {
                q.reject();
              }
            );
          }
        );
        return q.promise;
      },

      listDir: function (filePath) {
        var q = $q.defer();

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getDirectory(filePath, {create: false}, function (parent) {
              var reader = parent.createReader();
              reader.readEntries(
                function (entries) {
                  q.resolve(entries);
                },
                function () {
                  q.reject('DIR_READ_ERROR : ' + filePath);
                }
              );
            }, function () {
              q.reject('DIR_NOT_FOUND : ' + filePath);
            });
          }
        );

        return q.promise;
      },

      checkFile: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function checkFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getFile(filePath, {create: false},
              // File exists
              function () {
                q.resolve();
              },
              // File doesn't exist
              function () {
                q.reject();
              }
            );
          }
        );

        return q.promise;
      },

      createFile: function (filePath, replaceBOOL) {
        // Backward compatibility for previous function createFile(filepath replaceBOOL)
        var q = $q.defer();

        if (arguments.length == 3) {
          filePath = '/' + filePath + '/' + arguments[1];
          replaceBOOL = arguments[2];
        }

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getFile(filePath, {create: true, exclusive: replaceBOOL},
              function (success) {
                q.resolve(success);
              },
              function (err) {
                q.reject(err);
              });
          }
        );

        return q.promise;
      },

      removeFile: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function removeFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getFile(filePath, {create: false}, function (fileEntry) {
              fileEntry.remove(function () {
                q.resolve();
              });
            });
          }
        );

        return q.promise;
      },

      writeFile: function (filePath, data) {
        var q = $q.defer();

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getFile(filePath, {create: true},
              function (fileEntry) {
                fileEntry.createWriter(
                  function (fileWriter) {
                    fileWriter.onwriteend = function (evt) {
                      q.resolve(evt);
                    };
                    fileWriter.write(data);
                  },
                  function (error) {
                    q.reject(error);
                  });
              }
            );
          }
        );

        return q.promise;
      },

      readFile: function (filePath) {  /// now deprecated in new ng-cordova version
        var q = $q.defer();
        console.log('readFile is now deprecated as of v0.1.4-alpha, use readAsText instead');

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {

            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    q.resolve(this.result);
                  };

                  reader.readAsText(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },

      readAsText: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {

            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    q.resolve(this.result);
                  };

                  reader.readAsText(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },


      readAsDataURL: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {

            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    q.resolve(this.result);
                  };

                  reader.readAsDataURL(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },

      readAsBinaryString: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {

            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    q.resolve(this.result);
                  };

                  reader.readAsBinaryString(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },

      readAsArrayBuffer: function (filePath) {
        var q = $q.defer();

        // Backward compatibility for previous function readFile(dir, file)
        if (arguments.length == 2) {
          filePath = '/' + filePath + '/' + arguments[1];
        }

        getFilesystem().then(
          function (filesystem) {

            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    q.resolve(this.result);
                  };

                  reader.readAsArrayBuffer(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },

      readFileMetadata: function (filePath) {
        var q = $q.defer();

        getFilesystem().then(
          function (filesystem) {
            filesystem.root.getFile(filePath, {create: false},
              // success
              function (fileEntry) {
                fileEntry.file(function (file) {
                  q.resolve(file);
                });
              },
              // error
              function (error) {
                q.reject(error);
              });
          }
        );

        return q.promise;
      },

      readFileAbsolute: function () {
        var q = $q.defer();
        window.resolveLocalFileSystemURI(filePath,
          function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();
              reader.onloadend = function () {
                q.resolve(this.result);
              };

              reader.readAsText(file);
            })
          },
          function (error) {
            q.reject(error);
          }
        );
      },

      readFileMetadataAbsolute: function (filePath) {
        var q = $q.defer();
        window.resolveLocalFileSystemURI(filePath,
          function (fileEntry) {
            fileEntry.file(function (file) {
              q.resolve(file);
            })
          },
          function (error) {
            q.reject(error);
          }
        );

        return q.promise;
      },

      downloadFile: function (source, filePath, trustAllHosts, options) {
        var q = $q.defer();
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(source);

        fileTransfer.onprogress = function (progressEvent) {
          q.notify(progressEvent);
        };

        fileTransfer.download(
          uri,
          filePath,
          function (entry) {
            q.resolve(entry);
          },
          function (error) {
            q.reject(error);
          },
          trustAllHosts, options);

        return q.promise;
      },

      uploadFile: function (server, filePath, options) {
        var q = $q.defer();
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(server);

        fileTransfer.onprogress = function (progressEvent) {
          q.notify(progressEvent);
        };

        fileTransfer.upload(
          filePath,
          uri,
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          options);

        return q.promise
      }

    };

    function getFilesystem() {
      var q = $q.defer();

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024, function (filesystem) {
          q.resolve(filesystem);
        },
        function (err) {
          q.reject(err);
        });

      return q.promise;
    }
  }]);
