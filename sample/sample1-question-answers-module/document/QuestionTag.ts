import {EmbeddedDocument} from "typeodm/annotation/EmbeddedDocument";
import {IdField} from "typeodm/annotation/IdField";
import {Field} from "typeodm/annotation/Field";

@EmbeddedDocument()
export class QuestionTag {

    @IdField()
    id: string;

    @Field()
    name: string;

}