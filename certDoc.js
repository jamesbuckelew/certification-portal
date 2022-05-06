import { LightningElement, wire, api, track } from 'lwc';

import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import updateFile from '@salesforce/apex/updateFileUpload.updateFileUploaded';
import getObjectDocs from '@salesforce/apex/certObject.getObjectDocs';
import businessType from '@salesforce/schema/Certification__c.Business_Type__c';
import certType from '@salesforce/schema/Certification__c.certType__c';
import requiredDocs from '@salesforce/schema/Certification__c.Required_Documents__c';
import uploadList from '@salesforce/schema/Certification__c.Uploaded_Docs__c';
import certSpecialist from '@salesforce/schema/Certification__c.OwnerId';
import currentStep from '@salesforce/schema/Certification__c.Current_Step__c';
import fileAlert from '@salesforce/schema/Certification__c.Files_Uploaded__c';
import certId from '@salesforce/schema/Certification__c.Id';


const FIELDS = [ 
    businessType,
    certType,
    requiredDocs, 
    uploadList, 
    certSpecialist,
    currentStep, 
    fileAlert,
    certId,
    ];

const columns = [
    {label: 'Title', fieldName: 'Title'},
    {label: 'Tile Type', fieldName: 'FileType'}, 
    {label: 'Content Size (KB)', fieldName: 'ContentSize'},
    {label: 'Date Added', fieldName: 'ContentModifiedDate',type: 'date',
    typeAttributes:{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}}
];


export default class CertDoc extends LightningElement {
    @api recordId;
    @track data;
    @track columns = columns;

    @wire(getRecord, {recordId: '$recordId', fields: FIELDS})
    cert;

    get businessType() {
        return getFieldValue(this.cert.data, businessType);
    }

    get certType() {
        return getFieldValue(this.cert.data, certType);
    }

    get requiredDocs() {
        return getFieldValue(this.cert.data, requiredDocs);
    }

    get uploadList() {
        return getFieldValue(this.cert.data, uploadList);
    }

    get certSpecialist() {
        return getFieldValue(this.cert.data, certSpecialist);
    }

    get currentStep() {
        return getFieldValue(this.cert.data, currentStep);
    }

    get fileAlert () {
        return getFieldValue(this.cert.data, fileAlert);
    }

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx' ];
    }

    get getDocs() {
        getObjectDocs({recordId: this.recordId})
        .then(data => {
            this.data = data;
            return data;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error with related files list!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    handleUploadFinished(event) {
        updateFile({recordId: this.recordId})
        .then( () => {
            console.log('Step 2');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'File uploaded successfully!!',
                    variant: 'success',
                })
            );
        })
        .catch (error => {
            console.log('Step 1.5');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error with checkbox!!',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    }
}
