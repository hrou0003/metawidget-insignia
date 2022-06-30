( function() {

	'use strict';

	/**
	 * Angular directive for an editable table.
	 */

	angular.module( 'app' ).directive( 'editTable', [ '$compile', '$parse', '$http', function( $compile, $parse, $http ) {

        return {

            restrict: 'A',

            scope: {
                ngModel: '=',
                readOnly: '=',
                schema: '='
            },

            link: function (scope, element, attrs) {

            },

            compile: function( table, attrs ) {

                // postLink function

                return function( scope, table, attrs ) {

                    table.attr( 'class', 'table table-striped table-bordered table-hover' );
                    var columns = attrs.columns.split( ',' );

                    // thead

                    var tr = $( '<tr>' );
                    var thead = $( '<thead>' );
                    var tbody = $( '<tbody>' );
                    table.append( thead.append( tr ) );

                    for ( var loop = 0, length = columns.length; loop < length; loop++ ) {
                        var  col = columns[loop];
                        tr.append( $( '<th>' ).css( 'width', 100 / columns.length + '%' ).text( scope.schema.properties[col].label ) );
                    }

                    tr.append( $( '<th ng-show="!readOnly" style="width: 1%">' ) );

                    // tbody

                    var tr1 = $( '<tr ng-repeat="row in ngModel">' );
                    var tr2 = $( '<tr ng-show="!readOnly">' );

                    for ( var loop = 0, length = columns.length; loop < length; loop++ ) {

                        var columnMetawidget = $( '<metawidget ng-model="row.' + columns[loop] + '" config="metawidgetConfig">' );
                        tr1.append( $( '<td>' ).append( columnMetawidget ) );

                        if ( attrs.editTable !== 'add-only' ) {
                            var footerMetawidget = $( '<metawidget ng-model="newRow.' + columns[loop] + '" config="metawidgetConfig">' );
                            tr2.append( $( '<td>' ).append( footerMetawidget ) );
                        }
                    }

                    tr1.append( $( '<td ng-show="!readOnly" class="pointer-on-hover" ng-click="remove( row )"><div class="remove">remove</div></td>' ) );
                    tr2.append( $( '<td ng-show="!readOnly" class="pointer-on-hover" ng-click="add()"><div class="add">add</div></td>' ) );

                    // Compile

                    scope.metawidgetConfig = {
                        inspector: new metawidget.inspector.JsonSchemaInspector( scope.schema ),
                        addWidgetProcessors: [ new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor() ],
                        layout: new metawidget.layout.SimpleLayout()
                    };

                    var tbody = $( '<tbody>' );
                    table.append( tbody.append( tr1 ).append( tr2 ) );
                    $compile( thead )( scope );
                    $compile( tbody )( scope );

                    // Internal model

                    scope.newRow = {};

                    scope.add = function() {

                        scope.ngModel.push( angular.copy( scope.newRow ) );
                        scope.newRow = {};
                    }

                    scope.remove = function( row ) {

                        scope.ngModel.splice( scope.ngModel.indexOf( row ), 1 );
                    }
                }
            }
        };
    } ] )
} )();