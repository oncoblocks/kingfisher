/**
 * Created by xiuchengquek on 16/06/15.
 */



angular.module('dataUtil', []);


angular.module('dataUtil').factory('generalParser', function(){

    /**
     * General Parser that takes in the a list of required header
     * @param dataType String highlighting the data type - clinical, maf etc.
     * @param requiredHeader Column Fields Header That are required
     */
    var generalParser;

    generalParser = function (dataType, requiredHeader) {
        var self = this;

        self.dataType = dataType;
        self.requiredHeader = requiredHeader;
        self.userHeaderFields = [];
        self.missingFields = [];
        self.indexOrder = [];
        self.dataValues = [];
        self.malformedLines = [];

    };


     //Function to validate that the user Input has the required headers
    generalParser.prototype._validateHeader = function(){
        var self = this;

        var userHeader = self.userHeaderFields.map(function(value) { return value.toLowerCase()});
        var indexOrder = {};
        var missingFields = [];

        angular.forEach(this.requiredHeader, function(value){
            var indexNo = userHeader.indexOf(value.toLowerCase());
            if (indexNo == -1){
                missingFields.push(value);
            }
            else {
                indexOrder[value] = indexNo;
            }
        });

        self.missingFields = missingFields;
        self.indexOrder = indexOrder;
     };

    /**
     * Map Data to the correct header as a json object which is stored in attribute : dataValues
     * @param data list of lines from user Input
     */
    generalParser.prototype._mapDataToHeader = function(data) {
        var self = this;

        // private method for mapping data to header
        var mapOnIndex = function (lineValues, indexOrder) {
            var lineObj = {};
            angular.forEach(indexOrder, function (index, headerName) {

                lineObj[headerName] = lineValues[index];
            });
            return lineObj;
        };

        angular.forEach(data, function(line, lineNo){
            // check that length of line equivalent to index
            var lineValues= line.split('\t');

            // if the number of fields in line is less or more than the header, report as malformed line
            if (lineValues.length != Object.keys(self.indexOrder).length) {
                self.malformedLines.push(lineNo + 1);
            } else {
                self.dataValues.push(mapOnIndex(lineValues, self.indexOrder));
            }
        });
    };

    /**
     * Main method to call for converting userInput into an object.
     * @param userString
     */
    generalParser.prototype.parseData = function(userString){
        var self = this;

        self.userString = userString;
        var userLines = self.userString.split('\n');
        var userHeader = userLines.shift();
        self.userHeaderFields  = userHeader.split('\t');
        self._validateHeader();
        if (self.missingFields.length == 0){
            self._mapDataToHeader(userLines);
        }
    };

    return generalParser

});



angular.module('dataUtil').factory('mafParser', function(generalParser){

    // List of MAF fileds required for Fishplot
    var _complusoryMafFields = [];
    _complusoryMafFields.push("Hugo_Symbol");
    _complusoryMafFields.push("Entrez_Gene_Id");
    //_complusoryMafFields.push("Center");
    _complusoryMafFields.push("NCBI_Build");
    _complusoryMafFields.push("Chromosome");
    _complusoryMafFields.push("Start_Position");
    _complusoryMafFields.push("End_Position");
    _complusoryMafFields.push("Strand");
    //_complusoryMafFields.push("Variant_Classification");
    //_complusoryMafFields.push("Variant_Type");
    _complusoryMafFields.push("Reference_Allele");
    _complusoryMafFields.push("Tumor_Seq_Allele1");
    //_complusoryMafFields.push("Tumor_Seq_Allele2");
    _complusoryMafFields.push("Tumor_Sample_Barcode");
    //_complusoryMafFields.push("Matched_Norm_Sample_Barcode");
    //_complusoryMafFields.push("Validaton_Status");
    //_complusoryMafFields.push("Mutation_Status");
    //_complusoryMafFields.push("Sequence_Source");
    //_complusoryMafFields.push("Validation_Method");
    //_complusoryMafFields.push("Score");
    //_complusoryMafFields.push("BAM_File");
    //_complusoryMafFields.push("Tumor_Sample_UUID");
    //_complusoryMafFields.push("Matched_Norm_Sample_UUID");

    var mafParser = function(){
        this.dataType = "naf";
        this.requiredHeader = _complusoryMafFields;
    };

    mafParser.prototype = new generalParser;


    return mafParser
});

angular.module('dataUtil').factory('clinicalParser', function(generalParser){

    var _clinicalFields = [];
    _clinicalFields.push('Tumor_Sample_Barcode');
    _clinicalFields.push('Biopsy_Time');
    _clinicalFields.push('Treatment');


    var clinicalParser = function(){
        this.dataType = "clinical";
        this.requiredHeader = _clinicalFields;
    };
    clinicalParser.prototype = new generalParser;

    return clinicalParser
});









