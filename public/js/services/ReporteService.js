angular.module('ReporteService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Reportes', ['$rootScope', '$http', 'Fichas', 'Facturas', 'Egresos', 'Imagenes', '$filter',function($rootScope, $http, Fichas, Facturas, Egresos, Imagenes, $filter) {
        //var baseUrl = $rootScope.baseUrl;
        //var nameUrl = '/api/reportes';
        var Reportes = [
			{ 
				_id: 1, nombre: 'Servicios Pagados', titulo: 'Servicios', table: 'Fichas', 
				//filtros: ["fecha_ini", "fecha_fin", "cliente", "estado", "pagado"],
				filtros: {$gte: 'usuario.fecha', $lte: 'usuario.fecha', cliente: 'cliente._id', estado: 'estado', pagado: 'programas.pagado'},
				query: {}, 
				//select:{'folio':1, 'anio':1, 'monto_total':1},
				select:{},
				pageOrientation: 'landscape',
				columns:['fecha_corta','folio_ficha', 'usuario.usuario', 'programa.nombre', 'cliente.credencial', 'programa.total', 'programa.monto_apoyo_terceros', 'programa.pagado', 'programa.monto_suciqroo', 'programa.fecha_pago' , 'programa.factura.folio_factura'],
				//head:['Fecha','Folio', 'Operador', 'Programa', 'Folio Credencial', 'Precio Total', 'Terceros', {image: writeRotatedText('Pagado'), fit:[7,53], alignment: 'center'}, 'Suciqroo', 'Fecha Pago', 'Factura' ],
				head:['Fecha','Folio', 'Operador', 'Programa', 'Folio Credencial', 'Precio Total', 'Terceros', 'Pagado', 'Suciqroo', 'Fecha Pago', 'Factura' ],
				widths: ['auto','auto','auto','*','auto',40,40,'auto',40,'auto','auto'],
				estado: 'Activo'
			},
			//{ _id: 2, nombre: 'Proveedores Pagados', table: 'Facturas',
			// 	filtros: ["fecha_ini", "fecha_fin", "proveedor", "estado", "pagado"], query: {}, columns:[] },
			//{ _id: 3, nombre: 'Pogramas Vendidos', table: 'Fichas', 
			//	filtros: ["fecha_ini", "fecha_fin", "programa", "estado", "pagado"], query: {}, columns:[] },
			//{ _id: 4, nombre: 'Fichas por Usuario', table: 'Fichas', 
			//	filtros: ["fecha_ini", "fecha_fin", "usuario", "estado", "pagado"], query: {}, columns:[] },
			//{ _id: 5, nombre: 'Pago de Servicios', table: 'Fichas',
			//	filtros: ["estado", "fecha_ini", "fecha_fin", "programa" ], query: {}, columns:[] },
			//{ _id: 6, nombre: 'Historico', table: 'Historico',
			//	filtros: ["estado", "fecha_ini", "fecha_fin", "historico" ], query: {}, columns:[] },
			{ 
				_id: 7, nombre: 'Ficha', titulo: '', table: 'Fichas',
				filtros: { ficha: '_id' },
				query: {}, 
				select:{},
				pageOrientation: '',
				columns:['fecha_corta','programas_nombres', 'cliente.nombre_completo', 'cliente.direccion', 'cliente.telefono', 'cliente.credencial', 'monto_total', 'folio_ficha'],
				head:[{text: 'Fecha: ', alignment: 'right'}, 'Programa: ', 'Nombre: ', 'Dirección: ', 'Telefono: ', 'Credencial: ', 'Total: ', {text: 'Folio: ', alignment: 'center'}],
				widths: ['*','*','*','*','*','*','*','*'],
				estado: 'Activo'
			},
			{ 
				_id: 8, nombre: 'Factura', titulo: 'Factura', table: 'Facturas', 
				filtros: {factura: '_id'},
				query: {}, 
				select:{},
				pageOrientation: 'landscape',
				columns:['programa.folio_ficha', 'programa.nombre', 'programa.precio','programa.descuento','programa.total','programa.monto_apoyo_terceros','programa.monto_suciqroo','programa.tiene_descuento','programa.cortesia'],
				head:['Ficha', 'Programa', 'Precio', 'Descuento', 'Total', 'Terceros', 'Suciqroo', 'Descuento', 'Cortesia' ],
				widths: ['*',150,'*','*','*','*','*','*','*'],
				estado: 'Activo'
			},
			{ 
				_id: 9, nombre: 'Egreso', titulo: 'Egresos', table: 'Egresos', 
				filtros: {$gte: 'fecha', $lte: 'fecha', estado: 'estado' },
				query: {}, 
				select:{},
				pageOrientation: 'landscape',
				columns:['fecha', 'folio_egreso', 'monto_salida', 'monto_total', 'monto_cambio', 'estado', 'factura.folio_factura', 'oficina.nombre', 'usuario.usuario'],
				head:['Fecha', 'Folio', 'Salida', 'Total', 'Cambio', 'Estado', 'Factura', 'Oficina', 'Usuario' ],
				widths: ['*','*','*','*','*','*','*','*','*'],
				estado: 'Activo'
			},
		];



        //Variables para reportes
        var reporte = {};
        var dataSearch = {};
        var name = 'Reporte';
        var titulo = 'Titulo';
        var pageOrientation = '';
		var head = ['Nombre', 'Edad'];
		var columns = ['name', 'age'];
		var widths = ['*', '*'];
		var info = {
	    	title: 'Reporte',
		    author: 'EasingIE',
	  	}
		var externalDataRetrievedFromServer = [
		    { name: 'Bartek', age: 34 },
		    { name: 'John', age: 27 },
		    { name: 'Elizabeth', age: 30 },
		];
		var styles = {
				header: {
					bold: true,
					color: '#000',
					fontSize: 10
				},
				demoTable: {
					color: '#000',
					fontSize: 7
				}
		    };
		var dd = {
		    content: [
		        { text: 'Dynamic parts', style: 'header' },
		        table(head, columns, externalDataRetrievedFromServer)
		    ],
		    styles: styles
		}

        function getReporteById(reporte, dataSearch, descargar) {
        	reporte = reporte;
			var arrQuery = {};
			var and = [];
			//console.log('-- dataSearch');
			//console.log(dataSearch);
			_.each(reporte.filtros, function(value, filtro){
				if(dataSearch[filtro.toString()] != undefined && dataSearch[filtro.toString()] != '' ){
					var whereFiled = {};
					//whereFiled[filtro.toString()] = dataSearch[filtro.toString()]; version old
					//console.log('-- filtro');
					//console.log(filtro);

					if(filtro == '$gte' || filtro == '$lte'){
						whereFiled[value.toString()] = {};
						whereFiled[value.toString()][filtro.toString()] = dataSearch[filtro.toString()];  
						//{"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)
					} else {
						whereFiled[value.toString()] = dataSearch[filtro.toString()];
					}
						
					and.push(whereFiled);
				}
			});
			if(and.length > 0)
				arrQuery.query = { $and: and };
			else 
				arrQuery.query = {};
			arrQuery.select =  reporte.select;
			name = reporte.nombre;
			titulo = reporte.titulo;
			pageOrientation = reporte.pageOrientation;
			head = reporte.head;
			widths = reporte.widths;
			columns =  reporte.columns;

			//console.log('-- Arr Query');
			//console.log(arrQuery);

			//Vendria siendo esto pero por cada filtro
			//arrQuery.query = {
			//				$and: [
			//					{ 'estado': formTemp.estado },
			//					{ 'programa': formTemp.programa }
			//				]
			//			};
			getDataReporte(reporte.nombre, arrQuery, dataSearch, descargar);
	  	};

	  	function getDataReporte(nombre, query, dataSearch, descargar){
	  		switch(nombre){
				case 'Servicios Pagados':
					Fichas.query(query)
					.success(function(data) { 
						var externalData = [];
						if(data.instanceList){
							_.each(data.instanceList, function(instance){
								/*
								var objectData = {};
								_.each(columns, function(column){
									//objectData[column.toString()] = instance[column.toString()]; //old
									objectData[column.toString()] = ( _.property(column)(instance) != undefined ) ? _.property(column)(instance).toString() : '';
								});
								externalData.push(objectData);
								*/
								
								//console.log('--ficha');
								//console.log(instance);
								//console.log(dataSearch);
								_.each(instance.programas, function(programa){
									if( dataSearch['pagado'] == '' || programa.pagado == dataSearch['pagado'] ){
										//console.log('--programa');
										//console.log(programa);
										var objectData = {};
										var ficha = angular.copy(instance);
										//ficha.programas = [];
										//ficha.pagado = '';
										var object = angular.extend(ficha, { programa: programa });
										//console.log('--object');
										//console.log(object);
										_.each(columns, function(column){
											if(column == 'programa.fecha_pago')
												objectData[column.toString()] = ( _.property(column)(object) != undefined ) ? $filter('date')( _.property(column)(object) , 'dd/MM/yyyy') : '';
											else
												objectData[column.toString()] = ( _.property(column)(object) != undefined ) ? _.property(column)(object).toString() : '';
										});
										externalData.push(objectData);
									}
								})

							});
						}
						externalDataRetrievedFromServer = externalData;
						dd = {
							info: {
						    	title: name,
							    author: 'EasingIE',
						  	},
							pageOrientation: pageOrientation,
						    content: [
						    	{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
						        { text: titulo, style: 'header' },
						        table(head, columns, externalDataRetrievedFromServer)
						    ],
					    	styles: styles
						}
					    openPdf(descargar);
					})
					.error(function(data, status) {
						console.log('Error: ' + status);
	        			console.log(data);	
		            });

		            break;
				case 'Proveedores Pagados':
				case 'Balance General':
				case 'Fichas por Usuario':
				case 'Pago de Servicios':
				case 'Historico':
				case 'Ficha':
					Fichas.findById(dataSearch['ficha'])
					.success(function(data) {
						console.log(data);
						var externalData = [];
						columns = _.object(columns, head); //Creamos un objeto a partir de las columnas y el header
						_.each(columns, function(head, column){
							var objectData = {};
							
							if(column!='fecha_corta')
								externalData.push(head);

							if(column!='fecha_corta')
								objectData['text'] = ( ( _.property(column)(data) != undefined ) ? _.property(column)(data).toString() : '' );

							// ( 25 - length ) * 4 + (length * 1.5 )
							// ( 25 - length ) * 3.7 + (length * 1.5 ) - 10
							if(column!='fecha_corta' && column!='folio_ficha'){
								var strLine = head.toString() + objectData['text'];
								for(var i = 0; i< ( ( ( 25 - strLine.length ) * 3.7 ) + (strLine.length * 1.5) - ( 10 ) ) ; i++){
									objectData['text'] += ' ';
								}
								objectData['decoration'] = 'underline';
							}

							if(column=='monto_total')
								objectData['text'] +=  '\n';

							if(column!='fecha_corta')
								objectData['text'] +=  '\n';
						
							if(column!='fecha_corta')
								externalData.push(objectData);
						});
						console.log(externalData);
						externalDataRetrievedFromServer = {};
						externalDataRetrievedFromServer['text'] = externalData;
						externalDataRetrievedFromServer['margin'] = [5,5,30,5];
						dd = {
							info: {
						    	title: name,
							    author: 'EasingIE',
						  	},
							pageOrientation: pageOrientation,
							pageMargins: [ 20, 20, 15, 20 ],
						    content: [
							    {
						    		columns: [
						    			[	
						    				{
						    					columns: [
						    						{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
						    						{
						    							text: [
						    								{ text: 'Fecha: ', alignment: 'center'},
						    								{ text: angular.copy ( _.property('fecha_corta')(data) ) }
						    							]
						    						},
									        
						    					]
						    				},
									        angular.copy(externalDataRetrievedFromServer)
									        /*
											{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
											{text: 'Fecha: ', alignment: 'left'},
									        { text: 'Programa: Pediatria'},
									        { text: 'Nombere: Daniel Gomez'},
									        { text: 'Direccion: Pediatria'},
									        { text: 'Programa: Pediatria'},
									        */
									    ],
									    [
									    	{
						    					columns: [
						    						{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
						    						{
						    							text: [
						    								{ text: 'Fecha: ', alignment: 'center'},
						    								{ text: angular.copy ( _.property('fecha_corta')(data) ) }
						    							]
						    						},
									        
						    					]
						    				},
									        angular.copy(externalDataRetrievedFromServer)
									        //{ qr: 'EasingIE'}
									        /*
									     	{ 
									     		columns: [
											        { image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
											        {text: 'Fecha: ', alignment: 'left'},
									     		]
									     	},
									        { text: 'Programa: Pediatria'},
									        { text: 'Nombere: Daniel Gomez'},
									        { text: 'Direccion: Pediatria'},
									        { text: 'Programa: Pediatria'},
									        */
									    ],
							        ]
							    }
						    ],
					    	styles: styles
						}
					    openPdf(descargar);
					})
					.error(function(data, status) {
						console.log('Error: ' + status);
	        			console.log(data);	
		            });
					break;
				case 'Factura':
					Facturas.findById(dataSearch['factura'])
					.success(function(data) { 
						var externalData = [];
						
						_.each(data.programas, function(programa){
							var objectData = {};
							var factura = angular.copy(data);
							var object = angular.extend(factura, { programa: programa });
							//console.log('--object');
							//console.log(object);
							_.each(columns, function(column){
									objectData[column.toString()] = ( _.property(column)(object) != undefined ) ? _.property(column)(object).toString() : '';
							});
							externalData.push(objectData);
						});
						name = name+' '+ _.property('folio_factura')(angular.copy(data));
						titulo = name+': '+ _.property('folio_factura')(angular.copy(data))+ ', Proveedor: ' + _.property('proveedor.nombre')(angular.copy(data))
						+', Fecha: '+$filter('date')( _.property('fecha_alta')(angular.copy(data)) , 'dd/MM/yyyy')
						+', Estado: '+ _.property('estado')(angular.copy(data)) ;
						externalDataRetrievedFromServer = externalData;
						dd = {
							info: {
						    	title: name,
							    author: 'EasingIE',
						  	},
							pageOrientation: pageOrientation,
						    content: [
						    	{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
						        { text: titulo, style: 'header' },
						        table(head, columns, externalDataRetrievedFromServer)
						    ],
					    	styles: styles
						}
					    openPdf(descargar);
					})
					.error(function(data, status) {
						console.log('Error: ' + status);
	        			console.log(data);	
		            });
		            break;
	            case 'Egreso':
					Egresos.query(query)
					.success(function(data) { 
						var externalData = [];
						if(data.instanceList){
							_.each(data.instanceList, function(instance){
								var objectData = {};
								var object = angular.copy(instance);
								_.each(columns, function(column){
									if(column == 'fecha')
										objectData[column.toString()] = ( _.property(column)(object) != undefined ) ? $filter('date')( _.property(column)(object) , 'dd/MM/yyyy') : '';
									else
										objectData[column.toString()] = ( _.property(column)(object) != undefined ) ? _.property(column)(object).toString() : '';
								});
								externalData.push(objectData);
							});
						}
						externalDataRetrievedFromServer = externalData;
						dd = {
							info: {
						    	title: name,
							    author: 'EasingIE',
						  	},
							pageOrientation: pageOrientation,
						    content: [
						    	{ image: angular.copy( Imagenes.suciqroo_logo ), width: 100 },
						        { text: titulo, style: 'header' },
						        table(head, columns, externalDataRetrievedFromServer)
						    ],
					    	styles: styles
						}
					    openPdf(descargar);
					})
					.error(function(data, status) {
						console.log('Error: ' + status);
	        			console.log(data);	
		            });

		            break;
			}
	  	}

	  	// define your function for generating rotated text
		function writeRotatedText(text) {
			var ctx, canvas = document.createElement('canvas');
			// I am using predefined dimensions so either make this part of the arguments or change at will 
			canvas.width = 36;
			canvas.height = 140;
			ctx = canvas.getContext('2d');
			ctx.font = '24pt Arial';
			ctx.save();
			ctx.translate(36,140);
			ctx.rotate(-0.5*Math.PI);
			ctx.fillStyle = '#000';
			ctx.fillText(text , 0, 0);
			ctx.restore();
			console.log('-- url');
			console.log(canvas.toDataURL());
			return canvas.toDataURL();
		};

		//Pass to Base64 the image fo url
		function toDataUrl(src, callback, outputFormat) {
			var img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function() {
				var canvas = document.createElement('CANVAS');
				var ctx = canvas.getContext('2d');
				var dataURL;
				canvas.height = this.height;
				canvas.width = this.width;
				ctx.drawImage(this, 0, 0);
				dataURL = canvas.toDataURL(outputFormat);
				callback(dataURL);
			};
			img.src = src;
			if (img.complete || img.complete === undefined) {
				img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				img.src = src;
			}
		}

		function buildTableBody(head, columns, data) {
		    var body = [];
		    body.push(head);

		    angular.forEach(data,function(row) {
		        var dataRow = [];

		        angular.forEach(columns,function(column) {		        	
		            dataRow.push(row[column].toString());
		        })

		        body.push(dataRow);
		    });

		    return body;
		}

		function table(head, columns, data) {
		    return {
		    	style: 'demoTable',
		        table: {
		            headerRows: 1,
		            widths: widths,
		            body: buildTableBody(head, columns, data)
		        }
		    };
		}

		function openPdf(descargar) {			
			if(descargar)
				pdfMake.createPdf(dd).download(name);
		    else
		    	pdfMake.createPdf(dd).open();
	  	};

		return {
			getReportes : function() {
				return Reportes;
			},
			getReporteById : function(reporte, dataSearch, descargar) {
				return getReporteById(reporte, dataSearch, descargar);
			}
		}
	}]);