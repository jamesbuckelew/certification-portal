public with sharing class certObject {
    @AuraEnabled(cacheable=true)

    public static List<ContentDocument> getObjectDocs(Id recordId) {   
        List<ContentDocumentLink> CDLs = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        if (CDLs.size() < 1) return new List<ContentDocument>(); 

        // Make a List of ContentDocument IDs
        List <Id> CDIdList = new List <Id> ();
        for (ContentDocumentLink nextCDL : CDLs) {
            CDIdList.add(nextCDL.ContentDocumentId); }        

        List<ContentDocument> entries = [SELECT Id, Title, FileType, ContentModifiedDate, ContentSize FROM ContentDocument WHERE ContentDocument.Id IN :CDIdList];
        return entries;
    }
}
