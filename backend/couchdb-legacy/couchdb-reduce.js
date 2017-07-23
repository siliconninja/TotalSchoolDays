function(keys, values, rereduce) {
	
	if(!rereduce) {
		//var totalSchoolDaysArr = [];
		var totalSchoolDays = 0;
		
		//totalSchoolDaysArr.push();
	
		for(var i = 0; i < (values.length / 2); i++){
			totalSchoolDays += values[i].value;
		}

		return totalSchoolDays;
	}
	else {
		return 0;
	}

}
