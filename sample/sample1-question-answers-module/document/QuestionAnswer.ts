import {Document} from "typeodm/annotation/Document";
import {Field} from "typeodm/annotation/Field";
import {RelationWithOne} from "typeodm/annotation/RelationWithOne";
import {IdField} from "typeodm/annotation/IdField";
import {Question} from "./Question";
import {QuestionAuthor} from "./QuestionAuthor";

@Document()
export class QuestionAnswer {

    @IdField()
    id: string;

    @Field()
    text: string;

    @Field(type => QuestionAuthor)
    author: QuestionAuthor;

    @RelationWithOne<Question>(type => Question, question => question.answers)
    question: Question;

}