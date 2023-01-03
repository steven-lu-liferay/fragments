let graphQLQuery = `
	{
		myUserAccount {
			id
			emailAddress
			image
			jobTitle
	`

if(configuration.showRoles) {
	graphQLQuery += `
			roleBriefs {
				id
				name
			}	
	`
}

if(configuration.showUserGrps) {
	graphQLQuery += `
			userGroupBriefs {
				id
				name
			}	
	`
}

if(configuration.showAccts) {
	graphQLQuery += `
			accountBriefs {
				id
				name
			}	
	`
}

if(configuration.showOrgs) {
	graphQLQuery += `
			organizationBriefs {
				id
				name
			}	
	`
}

// close the myUserAccount query
graphQLQuery += '}'

graphQLQuery += `
		myUserAccountSites {
			items {
				id
				name
				friendlyUrlPath
    	}
  	}
	}`;

let postBody = {
	"query": graphQLQuery
};


Liferay.Util.fetch(
	"/o/graphql", {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(postBody),
		method: 'POST'
	}
)
.then((response) => response.json()) 
.then((data) => {
	console.log(data);
	
	if(data.data.myUserAccount) {
		const userDetailsElem = fragmentElement.querySelector(".user-membership-frag-details");
		if(data.data.myUserAccount.image && data.data.myUserAccount.image !== "") {
			const userImageNode = document.createElement("img");
			userImageNode.src = data.data.myUserAccount.image;
			userImageNode.setAttribute("width", "50px");
			userImageNode.setAttribute("height", "auto");
			userImageNode.classList.add("mr-2");
			userImageNode.classList.add("align-middle");
			userDetailsElem.prepend(userImageNode);
		}
		
		const userNameElem = userDetailsElem.querySelector(".user-details-name");
		if(data.data.myUserAccount.jobTitle && data.data.myUserAccount.jobTitle !== "") {
			const userJobTitleNode = document.createElement("div");
			userJobTitleNode.classList.add("p");
			userJobTitleNode.innerHTML = data.data.myUserAccount.jobTitle;
			userNameElem.parentElement.appendChild(userJobTitleNode);
		}

		if(data.data.myUserAccount.emailAddress && data.data.myUserAccount.emailAddress !== "") {
			const userEmailNode = document.createElement("div");
			userEmailNode.classList.add("p");
			userEmailNode.classList.add("text-italic");
			userEmailNode.innerHTML = data.data.myUserAccount.emailAddress;
			userNameElem.parentElement.appendChild(userEmailNode);
		}
	}
	
	const siteListElem = fragmentElement.querySelector(".user-membership-frag-sites-list");
	if(data.data.myUserAccountSites && data.data.myUserAccountSites.items.length > 0) {
		data.data.myUserAccountSites.items.forEach( (aSite) => {
			//console.log(aSite);
		  const siteListItemElem = document.createElement("li");
			const siteRefAnchor = document.createElement("a");
			siteRefAnchor.setAttribute("href", "web" + aSite.friendlyUrlPath);
			siteRefAnchor.classList.add("user-membership-frag-site-item");
			siteRefAnchor.innerHTML = aSite.name;
			siteListItemElem.appendChild(siteRefAnchor);
			siteListElem.appendChild(siteListItemElem);
		});
	}
	else {
		siteListElem.innerHTML = configuration.noItemMsg;
	}
	
	function listMembershipItems(dataList, listElem) {
		if(dataList.length > 0) {
			dataList.forEach(aDataItem => {
					const listItemElem = document.createElement("li");
					listItemElem.innerHTML = aDataItem.name;
					listElem.append(listItemElem);
			});
		}
		else {
			listElem.innerHTML = configuration.noItemMsg;
		}
	}
	
	if(data.data.myUserAccount.roleBriefs) {
		const roleListElem = fragmentElement.querySelector(".user-membership-frag-roles-list");
		listMembershipItems(data.data.myUserAccount.roleBriefs, roleListElem);
	}
	
	if(data.data.myUserAccount.userGroupBriefs) {
		const userGroupListElem = fragmentElement.querySelector(".user-membership-frag-usergroups-list");
		listMembershipItems(data.data.myUserAccount.userGroupBriefs, userGroupListElem);
	}

	if(data.data.myUserAccount.accountBriefs) {
		const acctListElem = fragmentElement.querySelector(".user-membership-frag-accts-list");
		listMembershipItems(data.data.myUserAccount.accountBriefs, acctListElem);
	}

	if(data.data.myUserAccount.organizationBriefs) {
		const orgListElem = fragmentElement.querySelector(".user-membership-frag-orgs-list");
		listMembershipItems(data.data.myUserAccount.organizationBriefs, orgListElem);
	}

})
.catch((error) => {
	console.log(error);
	containerElem = fragmentElement.findElementsByClassName("user-membership-frag-container");
	containerElem.innerHTML = "";
	const errorNotificationElem = document.createElement("h2");
	errorNotificationElem.classList.add("label");
	errorNotificationElem.classList.add("label-warning");
	errorNotificationElem.innerHTML = "An error occurred while getting User Membership data."
	containerElem.appendChild(errorNotificationElem);
});