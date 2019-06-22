import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthGuard } from "./shared/service/auth-guard.service";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "intro", loadChildren: "~/app/intro/intro.module#IntroModule" },
    { path: "selector", loadChildren: "~/app/selector/selector.module#SelectorModule" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule", canActivate:[AuthGuard] },
    { path: "planner", loadChildren: "~/app/planner/planner.module#PlannerModule" },
    { path: "planner-edit", loadChildren: "~/app/planner-edit/planner-edit.module#PlannerEditModule" },
    { path: "menu", loadChildren: "~/app/menu/menu.module#MenuModule" },
    { path: "menu-edit", loadChildren: "~/app/menu-edit/menu-edit.module#MenuEditModule" },

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)
        ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
