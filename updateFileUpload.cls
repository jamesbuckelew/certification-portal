public with sharing class updateFileUpload {

    @AuraEnabled
    public static List<Certification__c> updateFileUploaded(Id recordId) {
        List< Certification__c > cert = [SELECT Id, Files_Uploaded__c FROM Certification__c WHERE Id = :recordId];
        for (Certification__c cer : cert) {
            if (cer.Files_Uploaded__c == false) {
                cer.Files_Uploaded__c = true;
            }
        }
        update cert;
        return cert;
    }
}
