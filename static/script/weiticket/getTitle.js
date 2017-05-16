var channel = location.href.split('/')[3];

$.ajax({
	url: 'http://weiticket.com:8086/GetH5Title.aspx',
	data:{
		wxchannelCode: channel
	},
	success: function(data){
		$('title').text(data);
	}
})