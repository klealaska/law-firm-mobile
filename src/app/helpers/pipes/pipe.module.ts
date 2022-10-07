import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Safe } from './safe-html';

@NgModule({
    declarations: [Safe],
    imports: [
        CommonModule
    ],
    exports: [Safe]
})
export class PipeModule { }
