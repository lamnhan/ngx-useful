import { NgModule } from '@angular/core';

import { CategoryDataPipeModule } from './pipes/category/category.module';
import { TagDataPipeModule } from './pipes/tag/tag.module';
import { PageDataPipeModule } from './pipes/page/page.module';
import { PostDataPipeModule } from './pipes/post/post.module';
import { AuthorDataPipeModule } from './pipes/author/author.module';
import { ProfileDataPipeModule } from './pipes/profile/profile.module';

import {CategoryDataService} from './services/category/category.service';
import {TagDataService} from './services/tag/tag.service';
import {PageDataService} from './services/page/page.service';
import {PostDataService} from './services/post/post.service';
import {OptionDataService} from './services/option/option.service';
import {MetaDataService} from './services/meta/meta.service';
import {AuthorDataService} from './services/author/author.service';
import {ProfileDataService} from './services/profile/profile.service';
import {UserDataService} from './services/user/user.service';

@NgModule({
  declarations: [],
  imports: [
    CategoryDataPipeModule,
    TagDataPipeModule,
    PageDataPipeModule,
    PostDataPipeModule,
    AuthorDataPipeModule,
    ProfileDataPipeModule,
  ],
  providers: [
    CategoryDataService,
    TagDataService,
    PageDataService,
    PostDataService,
    OptionDataService,
    MetaDataService,
    AuthorDataService,
    ProfileDataService,
    UserDataService,
  ],
  exports: [
    CategoryDataPipeModule,
    TagDataPipeModule,
    PageDataPipeModule,
    PostDataPipeModule,
    AuthorDataPipeModule,
    ProfileDataPipeModule,
  ]
})
export class SchemataModule {}
