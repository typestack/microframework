import {Document} from "typeodm/annotation/Document";
import {Field} from "typeodm/annotation/Field";
import {RelationWithOne} from "typeodm/annotation/RelationWithOne";
import {RelationWithMany} from "typeodm/annotation/RelationWithMany";
import {IdField} from "typeodm/annotation/IdField";
import {ArrayField} from "typeodm/annotation/ArrayField";
import {QuestionAuthor} from "./QuestionAuthor";
import {QuestionAnswer} from "./QuestionAnswer";
import {QuestionTag} from "./QuestionTag";

@Document()
export class Question {

    @IdField()
    id: string;

    @Field()
    title: string;

    @Field()
    text: string;

    @Field(type => QuestionAuthor)
    author: QuestionAuthor;

    @ArrayField(type => QuestionTag)
    tags: QuestionTag[] = [];

    @RelationWithMany<QuestionAnswer>(type => QuestionAnswer, questionAnswer => questionAnswer.question)
    answers: QuestionAnswer[] = [];

}