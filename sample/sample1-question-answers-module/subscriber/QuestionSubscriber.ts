import {OdmEventSubscriber} from "typeodm/annotation/OdmEventSubscriber";
import {OdmSubscriber} from "typeodm/subscriber/OdmSubscriber";
import {Question} from "../document/Question";

@OdmEventSubscriber()
export class QuestionSubscriber implements OdmSubscriber<Question> {

    listenTo(): any {
        return Question;
    }

    afterLoad(question: Question) {
        console.log('Question is loaded: ', question);
    }

}