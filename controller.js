(function() {

    'use strict';
  
    /**
     * Controllers
     */
  
    angular.module('app').controller('simpleController', function($scope) {
  
      /**
       * Metawidget config.
       */
  
      var _tableLayout = new metawidget.layout.HeadingTagLayoutDecorator({
        delegate: new metawidget.layout.TableLayout({
          tableStyleClass: "table-form",
          columnStyleClasses: ["table-label-column", "table-component-column", "table-required-column"],
          footerStyleClass: "buttons"
        })
      });
  
      $scope.metawidgetConfig = {
  
  
  
  
        /**
         * Use JSON Schema so we can describe an array's metadata even
         * though it's empty. If you only care about non-empty arrays, you
         * could skip this and Metawidget will read metadata from the first
         * item in the array.
         */
  
        inspector: new metawidget.inspector.JsonSchemaInspector({
          
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'number',
            },
            address: {
              type: 'string',
            },
            
            row: {
  
              type: 'array',
              items: {
                properties: {
  
                  document: {
                    type: 'number',
                    hidden: true,
                    label: "Id documento"
                  },
                  prdCode: {
                    type: 'string',
                    hidden: false,
                    label: "Codice Articolo"
  
                  },
                  prdCustomerCode: {
                    type: 'string',
                    hidden: false,
                    label: "Codice Art.Cliente"
                  },
                  matCode: {
                    type: 'string',
                    hidden: false,
                    label: "Materiale"
                  },
                  ddetDescription: {
                    type: 'string',
                    hidden: false,
                    label: "Descrizione"
                  },
                  ddetQt: {
                    type: 'number',
                    hidden: false,
                    label: "Codice Articolo"
                  },
                  ddetPriceunit: {
                    type: 'number',
                    hidden: false,
                    label: "Prezzo Un."
                  },
                  ddetUm: {
                    type: 'string',
                    hidden: false,
                    label: "Um"
                  },
                  ddetDeliverydate: {
                    type: 'date',
                    hidden: false,
                    label: "Data Consegna"
                  }
                }
              }
            }
          }
        }),
  
        /**
         * Custom WidgetBuilder to instantiate our custom directive.
         */
  
        widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([
  
          function(elementName, attributes, mw) {
  
            // Editable tables
  
            if (attributes.type === 'array' && !metawidget.util.isTrueOrTrueString(attributes.readOnly)) {
  
              var typeAndNames = metawidget.util.splitPath(mw.path);
  
              console.log('typeAndNames', typeAndNames);
  
              if (typeAndNames.names === undefined) {
                typeAndNames.names = [];
              }
  
              typeAndNames.names.push(attributes.name);
              // typeAndNames.names.push( attributes.label );
              typeAndNames.names.push('0');
  
              console.log('typeAndNames', typeAndNames);
  
              var inspectionResult = mw.inspect(mw.toInspect, typeAndNames.type, typeAndNames.names);
              var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties(inspectionResult);
              var columns = '';
              var columnsLabel = '';
  
              for (var loop = 0, length = inspectionResultProperties.length; loop < length; loop++) {
  
                var columnAttribute = inspectionResultProperties[loop];
  
  
  
                if (metawidget.util.isTrueOrTrueString(columnAttribute.hidden)) {
                  continue;
                }
  
                if (columns !== '') {
                  columns += ',';
                }
                columns += columnAttribute.name;
                columnsLabel += columnAttribute.label;
              }
  
              $scope.rowSchemaId = $scope.rowSchemaId || 0;
              $scope.rowSchemaId++;
              var rowSchemaKey = 'rowSchema' + $scope.rowSchemaId;
              $scope[rowSchemaKey] = inspectionResult;
  
              var widget = $('<table>').attr('edit-table', '').attr('columns', columns).attr('ng-model', mw.path + '.' + attributes.name).attr('schema', rowSchemaKey);
              return widget[0];
            }
          },
          new metawidget.widgetbuilder.HtmlWidgetBuilder()
        ]),
        addWidgetProcessors: [new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor()],
        layout: _tableLayout
  
  
      }
  
      /**
       * Model.
       */
  
      $scope.resJson = [{
        progressivo: 10,
        document: 1,
        prdCode: 'abc',
        prdCustomerCode: 'pign1',
        matCode: "iron",
        ddetDescription: 'product 1',
        ddetQt: 1,
        ddetPriceunit: 100,
        ddetUm: "pz",
        ddetDeliverydate: '2014-06-21'
      }, {
        progressivo: 20,
        document: 1,
        prdCode: 'efg',
        prdCustomerCode: 'pign1',
        matCode: "iron",
        ddetDescription: 'product 2',
        ddetQt: 15,
        ddetPriceunit: 200,
        ddetUm: "pz",
        ddetDeliverydate: '2014-06-22'
      }];
  
      //THIS IS A WORKAROUND - ADDING MY JSON RESULT TO AN OBJECT FORMATTED LIKE METAWIDGET EXPECTS
      $scope.documentDetail = {
        row: []
      };
  
      $scope.documentDetail.row = ($scope.resJson);

      $scope.dispJson = window.localStorage.getItem('resJson');
  
      $scope.save = () => {
        window.localStorage.setItem('resJson', JSON.stringify($scope.resJson, null, 2))
        $scope.dispJson = $scope.resJson
      }
  
  
      $scope.readOnly = true;
  
  
  
    });
  })();