import { NgModule } from '@angular/core';

import { TagDataPipeModule } from './pipes/tag/tag.module';
import { CategoryDataPipeModule } from './pipes/category/category.module';

import {TagDataService} from './services/tag/tag.service';
import {CategoryDataService} from './services/category/category.service';
import {PageDataService} from './services/page/page.service';
import {PostDataService} from './services/post/post.service';
import {OptionDataService} from './services/option/option.service';
import {MetaDataService} from './services/meta/meta.service';
import {ProfileDataService} from './services/profile/profile.service';
import {UserDataService} from './services/user/user.service';

@NgModule({
  declarations: [],
  imports: [
    TagDataPipeModule,
    CategoryDataPipeModule,
  ],
  providers: [
    TagDataService,
    CategoryDataService,
    PageDataService,
    PostDataService,
    OptionDataService,
    MetaDataService,
    ProfileDataService,
    UserDataService,
  ],
  exports: [
    TagDataPipeModule,
    CategoryDataPipeModule,
  ]
})
export class SchemataModule {}
