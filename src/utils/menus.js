import {getRequest} from "@/utils/api";

export const initMenu=(router,store)=>{
    if(store.state.routes.length>0){
        return;
    }

    getRequest("/system/config/menu").then((data)=>{
        if(data){
            let fmRoutes = formatRoutes(data)
            router.addRoutes(fmRoutes);
            store.commit("initRoutes",fmRoutes);
        }

    })
}

export const formatRoutes=(routes)=>{
    let fmRoutes = [];
    routes.forEach((router)=>{
        let {
            path,
            name,
            iconCls,
            component,
            children,
            meta
        }=router;
        if(children && children instanceof Array){
            children = formatRoutes(children);
        }

        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            meta: meta,
            component(resolve){
                let p = path.split('/')[1];
                if(p=="home"){
                    p = "";
                }else{
                    p += "/";
                }
                require(["../views/"+p+component+".vue"],resolve);

            }
        }
        fmRoutes.push(fmRouter);

    })
    return fmRoutes;
}
