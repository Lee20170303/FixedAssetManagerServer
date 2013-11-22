function btnPrintClick(qrCode){  
	$("#assetDetails").hide();
	$("#assetEvent").hide();
	$("#underName").hide();
	if ($("#baseType").val()==0) {
		loadAssetDetails(qrCode);
		$("#assetDetails").after($("#underName").clone());
		$("#underName").remove()();
			// $.ajax({ 
			// 	type: 'POST', 
			// 	url: '/fixedasset/inspection', 
			// 	//data: { 'qrCode': '201307-03-0035' }, 
			// 	data:{'qrCode':qrCode},
			// 	success: function (data) { 
			// 		$("#assetDetails").hide();
			// 		$("#assetEvent").hide();
			// 		$("#underName").hide();
			// 		loadAssetDetails(qrCode);
			// 	}
			// });
}else{
	$("#assetDetails").hide();
	$("#assetEvent").hide();
	$("#underName").hide();
	loadUnderName('01312114');
	$("#underName").after($("#assetDetails").clone());
	$("#assetDetails").remove()();

}
}
function loadAssetDetails(qrCode,flag){
	$.ajax({ 
		type: 'POST', 
		url: '/fixedasset/inspection', 
			//data: { 'qrCode': '201307-03-0035' }, 
			data:{'qrCode':qrCode},
			success: function (data) { 
				$("#assetDetails").hide();
				$("#assetEvent").hide();
				$("#underName").hide();
				//loadAssetDetails(data);
				if(data.statusCode==0){
					$("#assetDetails").show();
					$("#assetDetails ul").html("");
					var det=data.data.faDetail;
					var temp ='<li class="list-group-item">';
					if (det.newId) {
						$("#assetDetails ul").append(temp+'设备编号:'+det.newId+'</li>');
					}else{
						alert("设备不存在!");
					}
					if (det.typeId) {
						if (data.data.typeInfo.typeName==det.assetName) {
							$("#assetDetails ul").append(temp+'设备名称:'+data.data.typeInfo.typeName+'</li>');
						}else{
							$("#assetDetails ul").append(temp+'设备名称:'+data.data.typeInfo.typeName + '-> '+ det.assetName +'</li>');
						}
					};
					if(det.oldId){
						$("#assetDetails ul").append(temp+'旧编号:'+det.oldId+'</li>');
					}
					if(det.userId){
						$("#assetDetails ul").append(temp+'领用人:'+data.data.userInfo.userName+'</li>');
						loadUnderName(det.userId);
					}
					if(det.departmentId){
						$("#assetDetails ul").append(temp+'部门:'+data.data.deptInfo.departmentName+'</li>');
					}
					if(det.assetBelong){
						$("#assetDetails ul").append(temp+'资产归属:'+det.assetBelong+'</li>');
					}
					if(det.currentStatus){
						$("#assetDetails ul").append(temp+'当前状态:'+det.currentStatus+'</li>');
					}
					if(det.brand){
						$("#assetDetails ul").append(temp+'品牌:'+det.brand+'</li>');
					}
					if(det.model){
						$("#assetDetails ul").append(temp+'型号:'+det.model+'</li>');
					}
					if(det.specifications){
						$("#assetDetails ul").append(temp+'规格:'+det.specifications+'</li>');
					}
					if(det.price>0){
						$("#assetDetails ul").append(temp+'价格:'+det.price+'</li>');
					}
					if(det.purchaseDate&&det.purchaseDate!='0000-00-00'){
						$("#assetDetails ul").append(temp+'采购日期:'+det.purchaseDate+'</li>');
					}
					if(det.possessDate&&det.possessDate!='0000-00-00'){
						$("#assetDetails ul").append(temp+'领用日期:'+det.possessDate+'</li>');
					}
					if(det.serviceCode){
						$("#assetDetails ul").append(temp+'快速服务代码:'+det.serviceCode+'</li>');
					}
					if(det.mac){
						$("#assetDetails ul").append(temp+'MAC地址:'+det.mac+'</li>');
					}
					if(det.reject>0){
						$("#assetDetails ul").append(temp+'已报废'+'</li>');
						if (det.rejectDate&&det.rejectDate!='0000-00-00') {
							$("#assetDetails ul").append(temp+'报废时间:'+det.rejectDate+'</li>');
						};
					}else{
						$("#assetDetails ul").append(temp+'未报废'+'</li>');
					}
					//add history 
					loadAssetEvevt(det.newId);
					//loadAssetEvevt(2);

				}
			}
		});

}

function loadUnderName(userId){
	$.ajax({ 
		type: 'GET', 
		url: '/user/'+userId+'/fixedassets', 
		success: function (data) { 
			if(data.statusCode==0){
				
				$("#underName").show();
				$("#addtr").html("");
				function createCellContainer(item){
					return $("<td></td>").html(item);
				}

				function createRowContainer(){
					return $("<tr></tr>");
				}

				function itemClick(value){
					return function(){
						loadAssetDetails(value);
					}
				}
				for (var i = 0; i < data.data.length; ++i) {
					var cellData = data.data[i];
					var row = createRowContainer();
					var cellNum = createCellContainer(i);
					var cellId = createCellContainer(cellData.newId);
					var cellName = createCellContainer(cellData.assetName);
					var link = $("<a href='javascript:void(0);'>查看详情</a>");
					link.click(itemClick(cellData.newId));
					var cellDetail = createCellContainer(link);
					row.append(cellNum);
					row.append(cellId);
					row.append(cellName);
					row.append(cellDetail);
					$("#addtr").append(row);
				}
			}
		}
	});
}
function loadAssetEvevt (aetid) {
	$.ajax({ 
		type: 'GET', 
		url: '/fixedasset/'+aetid+'/history', 
		success: function (data) { 
			if(data.statusCode==0){
				if (data.data.length>0) {
					$("#assetEvent").show();
					$("#historyul").html("");
					
					for (var i = 0; i < data.data.length; ++i) {
						$("#historyul").append();
						var eve=data.data[i];
						var temp = "<li class='list-group-item'>";
						var eTime=eve.aeTime.substring(0,10);
						switch(eve.aetpId)
						{
							case 3:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+eve.aetName+" 至 "+eve.userName+"("+eve.userId+")"+"</li>");
							break;
							case 4:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+" 从 "+eve.userName+"("+eve.userId+")名下 "+eve.aetName+"</li>");
							break;
							default:
							$("#historyul").append(temp+" 设备 : "+eve.atId+" 于 "+eTime+eve.aetName+"</li>");
							break;
						}
					}
				}else{
					$("#assetEvent").hide();
					$("#historyul").html("");
				}
			}
			
		}
	});
}