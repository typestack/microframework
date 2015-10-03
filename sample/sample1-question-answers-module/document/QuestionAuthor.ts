import {EmbeddedDocument} from "typeodm/annotation/EmbeddedDocument";
import {Field} from "typeodm/annotation/Field";
import {IdField} from "typeodm/annotation/IdField";

@EmbeddedDocument()
export class QuestionAuthor {

    @IdField()
    id: string;

    @Field()
    name: string;

}